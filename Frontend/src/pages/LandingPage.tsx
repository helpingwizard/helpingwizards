import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Recycle, Heart, Leaf, Droplets, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';
import { callApi } from '../api/call';
import AuthModal from '../components/AuthModal';

export default function LandingPage() {
  const { state, loadItems } = useApp();
  const navigate = useNavigate();
  const [isCallLoading, setIsCallLoading] = useState(false);
  const [callMessage, setCallMessage] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  
  // Load items on component mount
  useEffect(() => {
    loadItems();
  }, []);

  const featuredItems = state.items.slice(0, 6);

  const handleCallBot = async () => {
    setIsCallLoading(true);
    setCallMessage('');
    
    try {
      const response = await callApi.makeCall();
      setCallMessage(response.message);
    } catch (error) {
      setCallMessage(error instanceof Error ? error.message : 'Failed to make call');
    } finally {
      setIsCallLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setAuthMessage('');
    if (state.user) {
      // User is already logged in, check if admin
      if (state.user.is_admin) {
        navigate('/admin');
      } else {
        setAuthMessage('Access denied. Admin privileges required.');
      }
    } else {
      // User not logged in, open login modal
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    // After login, check if user is admin and redirect
    if (state.user?.is_admin) {
      navigate('/admin');
    } else if (state.user) {
      setAuthMessage('Access denied. Admin privileges required.');
    }
  };

  // Static sustainability stats for demonstration
  const sustainabilityStats = {
    itemsSwapped: 15420,
    co2Saved: 38550,
    waterSaved: 692340,
    communityMembers: 2847
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-emerald-600 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Swap, Share, Save the Planet
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Join the sustainable fashion revolution. Exchange clothes, build community, 
              and make a positive impact on the environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/browse"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center"
              >
                Start Swapping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/browse"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200 inline-flex items-center justify-center"
              >
                Browse Items
              </Link>
              <button
                onClick={handleAdminLogin}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                🛡️ Admin Login
              </button>
              <button
                onClick={handleCallBot}
                disabled={isCallLoading}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isCallLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Calling...
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-5 w-5" />
                    Call a bot
                  </>
                )}
              </button>
            </div>
            {callMessage && (
              <div className={`mt-4 p-3 rounded-lg ${
                callMessage.includes('success') || callMessage.includes('initiated')
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {callMessage}
              </div>
            )}
            {authMessage && (
              <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-800 border border-red-200">
                {authMessage}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ReWear?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of fashion-forward, environmentally conscious individuals 
              who are making a difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sustainability */}
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainable Fashion</h3>
              <p className="text-gray-600">
                Reduce waste and carbon footprint by giving clothes a second life. 
                Every swap helps protect our environment.
              </p>
            </div>

            {/* Community */}
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Community</h3>
              <p className="text-gray-600">
                Connect with like-minded individuals who share your values. 
                Build lasting friendships through fashion.
              </p>
            </div>

            {/* Savings */}
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Savings</h3>
              <p className="text-gray-600">
                Refresh your wardrobe without breaking the bank. 
                Get quality pieces through our points-based system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Items
            </h2>
            <p className="text-lg text-gray-600">
              Discover amazing pieces from our community members
            </p>
          </div>
          
          {featuredItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Link
                  to="/browse"
                  className="btn-primary inline-flex items-center"
                >
                  View All Items
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-6">
                No items available yet. Be the first to list an item!
              </p>
              <Link
                to="/add-item"
                className="btn-primary inline-flex items-center"
              >
                List Your First Item
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Impact Together
            </h2>
            <p className="text-lg opacity-90">
              See how our community is making a difference
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Recycle className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">
                {sustainabilityStats.itemsSwapped.toLocaleString()}
              </div>
              <div className="text-sm opacity-90">Items Swapped</div>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">
                {sustainabilityStats.co2Saved.toLocaleString()}kg
              </div>
              <div className="text-sm opacity-90">CO2 Saved</div>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Droplets className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">
                {sustainabilityStats.waterSaved.toLocaleString()}L
              </div>
              <div className="text-sm opacity-90">Water Saved</div>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold mb-2">
                {sustainabilityStats.communityMembers.toLocaleString()}
              </div>
              <div className="text-sm opacity-90">Community Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Sustainable Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our community today and make a positive impact on the planet 
            while refreshing your wardrobe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/add-item"
              className="btn-primary inline-flex items-center justify-center"
            >
              List an Item
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/browse"
              className="btn-secondary inline-flex items-center justify-center"
            >
              Browse Items
            </Link>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        initialMode="login"
      />
    </div>
  );
} 