import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Calendar, Award, MessageCircle, UserPlus, MapPin, Package, TrendingUp, Leaf } from 'lucide-react';
import { sampleUsers, sampleItems } from '../data/sampleData';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';

type TabType = 'items' | 'history' | 'reviews' | 'impact';

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('items');

  const user = sampleUsers.find(u => u.id === id) || state.user;
  const userItems = sampleItems.filter(item => item.owner.id === id);
  const isOwnProfile = state.user?.id === id;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'items', label: 'Listed Items', count: userItems.length },
    { id: 'history', label: 'Swap History', count: user.swapsCompleted },
    { id: 'reviews', label: 'Reviews', count: Math.floor(user.swapsCompleted * 0.8) },
    { id: 'impact', label: 'Impact', count: user.impactScore }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'items':
        return (
          <div>
            {userItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userItems.map(item => (
                  <ItemCard key={item.id} item={item} showOwner={false} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Package className="h-6 w-6 text-gray-400" />}
                title={isOwnProfile ? "You haven't listed any items yet" : "No items listed"}
                description={isOwnProfile ? "Start by listing your first item to begin swapping!" : "This user hasn't listed any items yet."}
                action={isOwnProfile ? <button className="btn-primary">List Your First Item</button> : undefined}
              />
            )}
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4">
            {user.swapsCompleted > 0 ? (
              Array.from({ length: Math.min(user.swapsCompleted, 5) }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 rounded-full p-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Successful Swap</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(Date.now() - index * 86400000 * 7).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-green-600">+{25 + index * 5} points</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Exchanged {['vintage jacket', 'summer dress', 'leather boots', 'knit sweater', 'silk scarf'][index]} 
                    with {['Alex', 'Sarah', 'Emma', 'Mike', 'Lisa'][index]}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<TrendingUp className="h-6 w-6 text-gray-400" />}
                title="No swap history yet"
                description="Completed swaps will appear here."
                action={undefined}
              />
            )}
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-4">
            {user.swapsCompleted > 0 ? (
              Array.from({ length: Math.min(Math.floor(user.swapsCompleted * 0.8), 5) }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`https://images.unsplash.com/photo-${1500000000 + index}?w=40&h=40&fit=crop&crop=face`}
                        alt="Reviewer"
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {['Alex Chen', 'Sarah Davis', 'Emma Wilson', 'Mike Johnson', 'Lisa Brown'][index]}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(Date.now() - index * 86400000 * 10).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (5 - index % 2) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {[
                      'Great communication and the item was exactly as described!',
                      'Smooth transaction and fast delivery. Highly recommend!',
                      'Perfect condition item and very friendly swapper.',
                      'Excellent experience! Would definitely swap again.',
                      'Amazing quality and great to work with!'
                    ][index]}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<Star className="h-6 w-6 text-gray-400" />}
                title="No reviews yet"
                description="Reviews from swap partners will appear here."
                action={undefined}
              />
            )}
          </div>
        );

      case 'impact':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary-500 to-emerald-500 rounded-lg text-white p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Environmental Impact</h3>
                <p className="text-lg opacity-90 mb-4">
                  Your contribution to sustainable fashion
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">
                      {(user.swapsCompleted * 2.5).toFixed(1)}kg
                    </div>
                    <div className="text-sm opacity-90">CO2 Prevented</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">
                      {(user.swapsCompleted * 45).toFixed(0)}L
                    </div>
                    <div className="text-sm opacity-90">Water Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">
                      {user.swapsCompleted}
                    </div>
                    <div className="text-sm opacity-90">Items Saved</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.swapsCompleted >= 5 && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="bg-green-100 rounded-full p-2">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-900">Eco Warrior</h4>
                      <p className="text-sm text-green-700">Completed 5+ swaps</p>
                    </div>
                  </div>
                )}
                
                {user.swapsCompleted >= 10 && (
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="bg-blue-100 rounded-full p-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-900">Swap Master</h4>
                      <p className="text-sm text-blue-700">Completed 10+ swaps</p>
                    </div>
                  </div>
                )}
                
                {user.swapsCompleted >= 20 && (
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="bg-purple-100 rounded-full p-2">
                      <Leaf className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-900">Sustainability Champion</h4>
                      <p className="text-sm text-purple-700">Completed 20+ swaps</p>
                    </div>
                  </div>
                )}
                
                {user.rating >= 4.5 && (
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="bg-yellow-100 rounded-full p-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-yellow-900">Top Rated</h4>
                      <p className="text-sm text-yellow-700">4.5+ star rating</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-6">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-24 w-24 rounded-full"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-600">{user.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Joined {new Date(user.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Community Member</span>
                  </div>
                </div>
              </div>
              
              {!isOwnProfile && (
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <button className="btn-primary inline-flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </button>
                  <button className="btn-secondary inline-flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{user.itemsListed}</div>
                <div className="text-sm text-gray-500">Items Listed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{user.swapsCompleted}</div>
                <div className="text-sm text-gray-500">Swaps Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{user.followers.length}</div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{user.impactScore}</div>
                <div className="text-sm text-gray-500">Impact Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 