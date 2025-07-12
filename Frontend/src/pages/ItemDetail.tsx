import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MapPin, Star, Coins, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import Modal from '../components/Modal';

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch, loadItems, createSwapRequest } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');

  // Load items on component mount
  useEffect(() => {
    loadItems();
  }, []);

  const item = state.items.find(item => item.id === Number(id));
  const similarItems = state.items.filter(i => 
    i.id !== Number(id) && 
    i.category === item?.category
  ).slice(0, 4);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
          <Link to="/browse" className="btn-primary">Browse Items</Link>
        </div>
      </div>
    );
  }

  const itemImages = item.images && item.images.length > 0 ? item.images : ['/placeholder-image.jpg'];

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? itemImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === itemImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleSwapRequest = async () => {
    if (!state.user || !item) return;
    
    try {
      const swapData = {
        item_id: item.id,
        requester_id: state.user.id,
        owner_id: item.owner_id,
        message: swapMessage,
      };

      await createSwapRequest(swapData);
      setShowSwapModal(false);
      setSwapMessage('');
    } catch (error) {
      console.error('Failed to create swap request:', error);
      // Could add user-friendly error handling here
    }
  };

  const handleToggleFavorite = () => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: item.id });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/browse"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Browse
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src={itemImages[currentImageIndex]}
                alt={item.title}
                className="w-full h-96 object-cover"
              />
              
              {itemImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-sm"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-sm"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}
              
              {/* Image indicators */}
              {itemImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {itemImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {itemImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {itemImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>Size {item.size}</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
                      item.condition === 'Very good' ? 'bg-blue-100 text-blue-800' :
                      item.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.condition}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <Heart
                    className={`h-6 w-6 ${
                      item.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{item.location}</span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2 text-primary-600">
                  <Coins className="h-5 w-5" />
                  <span className="text-2xl font-bold">{item.points}</span>
                  <span className="text-sm">points</span>
                </div>
                <div className="text-sm text-gray-500">
                  or swap with similar item
                </div>
              </div>

              <div className="space-y-4">
                {state.user ? (
                  <button
                    onClick={() => setShowSwapModal(true)}
                    className="w-full btn-primary"
                  >
                    Request Swap
                  </button>
                ) : (
                  <div className="text-center text-gray-500">
                    Please log in to request a swap
                  </div>
                )}

                <div className="text-sm text-gray-500 text-center">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Secure swap guaranteed
                </div>
              </div>
            </div>

            {/* Item Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {item.description || 'No description provided.'}
              </p>
            </div>

            {/* Tags */}
            {item.tags && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.split(',').map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Owner Information</h3>
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-sm text-gray-600">U</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Owner #{item.owner_id}</div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>5.0 rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Items */}
        {similarItems.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarItems.map(similarItem => (
                <ItemCard key={similarItem.id} item={similarItem} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Swap Request Modal */}
      <Modal
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        title="Request Swap"
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Send a message to the owner explaining why you'd like to swap and what you might offer in return.
          </div>
          <textarea
            value={swapMessage}
            onChange={(e) => setSwapMessage(e.target.value)}
            placeholder="Hi! I'm interested in swapping for this item. I have..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="flex space-x-3">
            <button
              onClick={() => setShowSwapModal(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSwapRequest}
              disabled={!swapMessage.trim()}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 