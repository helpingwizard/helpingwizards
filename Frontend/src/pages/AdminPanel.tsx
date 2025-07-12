import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  BarChart3, 
  Users, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Eye,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { adminApi, AdminStats } from '../api/admin';
import { Item } from '../api/items';
import { User } from '../api/auth';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'items' | 'users'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [itemFilter, setItemFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Check if user is admin
  const isAdmin = state.user?.is_admin;

  useEffect(() => {
    if (!state.user) {
      navigate('/');
      return;
    }
    
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    loadAdminData();
  }, [state.user, isAdmin, navigate]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsData, itemsData, usersData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getAllItems(),
        adminApi.getAllUsers()
      ]);
      
      setStats(statsData);
      setItems(itemsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadItemsByFilter = async (filter: typeof itemFilter) => {
    try {
      let itemsData: Item[];
      
      switch (filter) {
        case 'all':
          itemsData = await adminApi.getAllItems();
          break;
        case 'pending':
          itemsData = await adminApi.getPendingItems();
          break;
        case 'approved':
          itemsData = await adminApi.getItemsByStatus('available');
          break;
        case 'rejected':
          itemsData = await adminApi.getItemsByStatus('rejected');
          break;
        default:
          itemsData = await adminApi.getPendingItems();
      }
      
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const handleApproveItem = async (itemId: number) => {
    try {
      await adminApi.approveItem(itemId);
      await loadItemsByFilter(itemFilter);
      await loadAdminData(); // Refresh stats
    } catch (error) {
      console.error('Error approving item:', error);
    }
  };

  const handleRejectItem = async (itemId: number) => {
    try {
      await adminApi.rejectItem(itemId);
      await loadItemsByFilter(itemFilter);
      await loadAdminData(); // Refresh stats
    } catch (error) {
      console.error('Error rejecting item:', error);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await adminApi.deleteItem(itemId);
        await loadItemsByFilter(itemFilter);
        await loadAdminData(); // Refresh stats
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleFilterChange = (newFilter: typeof itemFilter) => {
    setItemFilter(newFilter);
    loadItemsByFilter(newFilter);
  };

  if (!state.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access admin panel</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have admin permissions to access this page.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <p className="text-gray-600">Manage items, users, and platform oversight</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('items')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'items'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Items ({stats?.pending_items || 0} pending)
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Users
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.total_items}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Approval</p>
                    <p className="text-2xl font-bold text-orange-600">{stats?.pending_items}</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Approved Items</p>
                    <p className="text-2xl font-bold text-green-600">{stats?.approved_items}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rejected Items</p>
                    <p className="text-2xl font-bold text-red-600">{stats?.rejected_items}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.total_users}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Admin Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.admin_users}</p>
                  </div>
                  <Shield className="w-8 h-8 text-indigo-500" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setActiveTab('items');
                    handleFilterChange('pending');
                  }}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-900">Review Pending Items</p>
                      <p className="text-sm text-gray-600">{stats?.pending_items} items awaiting approval</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-900">Manage Users</p>
                      <p className="text-sm text-gray-600">{stats?.total_users} registered users</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleFilterChange('pending')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    itemFilter === 'pending'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending ({stats?.pending_items})
                </button>
                <button
                  onClick={() => handleFilterChange('approved')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    itemFilter === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Approved ({stats?.approved_items})
                </button>
                <button
                  onClick={() => handleFilterChange('rejected')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    itemFilter === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Rejected ({stats?.rejected_items})
                </button>
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    itemFilter === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({stats?.total_items})
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No items found for the selected filter.
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                            item.status === 'available' ? 'bg-green-100 text-green-700' :
                            item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{item.description}</p>
                        <div className="text-sm text-gray-500">
                          <span>Category: {item.category}</span>
                          <span className="mx-2">•</span>
                          <span>Size: {item.size}</span>
                          <span className="mx-2">•</span>
                          <span>Condition: {item.condition}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => navigate(`/item/${item.id}`)}
                          className="p-2 text-gray-500 hover:text-gray-700"
                          title="View Item"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveItem(item.id)}
                              className="p-2 text-green-500 hover:text-green-700"
                              title="Approve Item"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectItem(item.id)}
                              className="p-2 text-red-500 hover:text-red-700"
                              title="Reject Item"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-500 hover:text-red-700"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Users</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items Listed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-600 font-medium">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.is_admin ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.is_admin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.items_listed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.join_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 