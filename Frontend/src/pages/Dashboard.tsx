import { Link } from 'react-router-dom';
import { Plus, Package, Clock, CheckCircle, Leaf, TrendingUp, Star, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sampleItems } from '../data/sampleData';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';

export default function Dashboard() {
  const { state } = useApp();
  const user = state.user;

  // Filter items for current user
  const myItems = sampleItems.filter(item => item.owner.id === user?.id);
  const pendingSwaps = state.swapRequests.filter(req => req.ownerId === user?.id && req.status === 'pending');
  const completedSwaps = state.swapRequests.filter(req => 
    (req.ownerId === user?.id || req.requesterId === user?.id) && req.status === 'completed'
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your dashboard</h2>
          <Link to="/" className="btn-primary">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-16 w-16 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                <p className="text-gray-600">Ready to make some swaps today?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{user.points}</div>
                <div className="text-sm text-gray-500">Points</div>
              </div>
              <Link
                to="/add-item"
                className="btn-primary inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                List Item
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{user.itemsListed}</div>
                <div className="text-sm text-gray-500">Items Listed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{user.swapsCompleted}</div>
                <div className="text-sm text-gray-500">Successful Swaps</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3 mr-4">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{user.points}</div>
                <div className="text-sm text-gray-500">Points Earned</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-emerald-100 rounded-full p-3 mr-4">
                <Leaf className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{user.impactScore}</div>
                <div className="text-sm text-gray-500">Impact Score</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Listed Items */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">My Listed Items</h2>
                <Link
                  to="/add-item"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Add New Item
                </Link>
              </div>
            </div>
            <div className="p-6">
              {myItems.length > 0 ? (
                <div className="space-y-4">
                  {myItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.category} • {item.condition}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-primary-600 font-medium">{item.points} points</span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-500">{item.location}</span>
                        </div>
                      </div>
                      <Link
                        to={`/item/${item.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                  {myItems.length > 3 && (
                    <div className="text-center pt-4">
                      <Link
                        to={`/profile/${user.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View All Items ({myItems.length})
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState
                  icon={<Package className="h-6 w-6 text-gray-400" />}
                  title="No items listed yet"
                  description="Start by listing your first item to begin swapping with the community."
                  action={
                    <Link to="/add-item" className="btn-primary">
                      List Your First Item
                    </Link>
                  }
                />
              )}
            </div>
          </div>

          {/* Pending Swap Requests */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Pending Swap Requests</h2>
            </div>
            <div className="p-6">
              {pendingSwaps.length > 0 ? (
                <div className="space-y-4">
                  {pendingSwaps.map((swap) => {
                    const item = sampleItems.find(i => i.id === swap.itemId);
                    return (
                      <div key={swap.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{item?.title}</h3>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            Pending
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{swap.message}</p>
                        <div className="flex space-x-2">
                          <button className="btn-primary text-sm py-1 px-3">Accept</button>
                          <button className="btn-secondary text-sm py-1 px-3">Decline</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={<Clock className="h-6 w-6 text-gray-400" />}
                  title="No pending requests"
                  description="When others request to swap with your items, they'll appear here."
                  action={null}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sustainability Impact */}
        <div className="mt-8 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-lg text-white p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Your Sustainability Impact</h2>
            <p className="text-lg opacity-90 mb-6">
              See how your swaps are helping the environment
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {(user.swapsCompleted * 2.5).toFixed(1)}kg
                </div>
                <div className="text-sm opacity-90">CO2 Prevented</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {(user.swapsCompleted * 45).toFixed(0)}L
                </div>
                <div className="text-sm opacity-90">Water Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {user.swapsCompleted}
                </div>
                <div className="text-sm opacity-90">Items Diverted from Landfill</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 