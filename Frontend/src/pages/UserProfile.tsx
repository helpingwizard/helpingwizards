import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Calendar, Award, MessageCircle, UserPlus, MapPin, Package, TrendingUp, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { state, loadItems } = useApp();

  // Load items on component mount
  useEffect(() => {
    loadItems();
  }, []);

  // For now, if viewing current user's profile, show their data
  // Otherwise show a placeholder since we don't have other user data from backend yet
  const isCurrentUser = state.user && state.user.id === Number(id);
  const user = isCurrentUser ? state.user : null;
  const userItems = state.items.filter(item => item.owner_id === Number(id));

  if (!user && !isCurrentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User profile not available</h2>
          <p className="text-gray-600">This feature is coming soon!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-3xl text-gray-600">U</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white rounded-full p-2">
                <Star className="h-4 w-4 fill-current" />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user?.name || `User #${id}`}
              </h1>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{user?.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {user?.join_date ? new Date(user.join_date).toLocaleDateString() : 'Recently'}</span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{user?.rating || '5.0'}</span>
                  <span className="text-gray-500">rating</span>
                </div>
                <div className="text-sm text-gray-500">
                  {user?.swaps_completed || 0} swaps completed
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isCurrentUser && (
              <div className="flex space-x-3">
                <button className="btn-secondary inline-flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow
                </button>
                <button className="btn-primary inline-flex items-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-600">Items Listed</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user?.items_listed || userItems.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="text-gray-600">Swaps Completed</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user?.swaps_completed || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    <span className="text-gray-600">Points Earned</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user?.points || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-5 w-5 text-emerald-500" />
                    <span className="text-gray-600">Impact Score</span>
                  </div>
                  <span className="font-semibold text-gray-900">{user?.impact_score || 0}</span>
                </div>
              </div>
            </div>

            {/* Sustainability Impact */}
            <div className="bg-gradient-to-r from-primary-500 to-emerald-500 rounded-lg text-white p-6">
              <h3 className="text-lg font-semibold mb-4">Environmental Impact</h3>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {((user?.swaps_completed || 0) * 2.5).toFixed(1)}kg
                  </div>
                  <div className="text-sm opacity-90">CO2 Prevented</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {((user?.swaps_completed || 0) * 45).toFixed(0)}L
                  </div>
                  <div className="text-sm opacity-90">Water Saved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isCurrentUser ? 'My Items' : `${user?.name || 'User'}'s Items`}
                </h2>
                <p className="text-gray-600 mt-1">
                  {userItems.length} items listed
                </p>
              </div>
              
              <div className="p-6">
                {userItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userItems.map(item => (
                      <ItemCard key={item.id} item={item} showOwner={false} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Package className="h-6 w-6 text-gray-400" />}
                    title={isCurrentUser ? "No items listed yet" : "No items found"}
                    description={
                      isCurrentUser 
                        ? "Start by listing your first item to begin swapping with the community."
                        : "This user hasn't listed any items yet."
                    }
                    action={
                      isCurrentUser ? (
                        <button className="btn-primary">
                          List Your First Item
                        </button>
                      ) : null
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 