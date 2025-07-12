import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MapPin, Star, Coins, MessageCircle, Shield, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sampleItems } from '../data/sampleData';
import ItemCard from '../components/ItemCard';
import Modal from '../components/Modal';

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const { state, dispatch } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');

  const item = sampleItems.find(item => item.id === id);
  const similarItems = sampleItems.filter(i => 
    i.id !== id && 
    (i.category === item?.category || i.tags.some(tag => item?.tags.includes(tag)))
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

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? item.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === item.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleSwapRequest = () => {
    if (!state.user) return;
    
    const newSwapRequest = {
      id: Date.now().toString(),
      itemId: item.id,
      requesterId: state.user.id,
      ownerId: item.owner.id,
      status: 'pending' as const,
      message: swapMessage,
      dateCreated: new Date().toISOString().split('T')[0]
    };

    dispatch({ type: 'ADD_SWAP_REQUEST', payload: newSwapRequest });
    setShowSwapModal(false);
    setSwapMessage('');
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
                src={item.images[currentImageIndex]}
                alt={item.title}
                className="w-full h-96 object-cover"
              />
              
              {item.images.length > 1 && (
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
              {item.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {item.images.map((_, index) => (
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
            {item.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {item.images.map((image, index) => (
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
                      item.condition === 'Very Good' ? 'bg-blue-100 text-blue-800' :
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
                <button
                  onClick={() => setShowSwapModal(true)}
                  className="w-full btn-primary"
                >
                  Request Swap
                </button>
                <button className="w-full btn-secondary">
                  Redeem with Points
                </button>
              </div>
            </div>

            {/* Owner Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={item.owner.avatar}
                  alt={item.owner.name}
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{item.owner.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{item.owner.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {item.owner.swapsCompleted} successful swaps
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/profile/${item.owner.id}`}
                    className="btn-secondary text-sm"
                  >
                    View Profile
                  </Link>
                  <button className="btn-ghost text-sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
          <p className="text-gray-600 leading-relaxed">{item.description}</p>
          
          {/* Tags */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {item.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-amber-600 mr-2" />
            <h3 className="text-lg font-semibold text-amber-900">Safety Tips</h3>
          </div>
          <ul className="space-y-2 text-sm text-amber-800">
            <li>• Meet in a public place for item exchange</li>
            <li>• Verify item condition before completing the swap</li>
            <li>• Use ReWear's messaging system for communication</li>
            <li>• Report any suspicious activity to our support team</li>
          </ul>
        </div>

        {/* Similar Items */}
        {similarItems.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Similar Items</h3>
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
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={item.images[0]}
              alt={item.title}
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div>
              <h4 className="font-medium text-gray-900">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.category} • Size {item.size}</p>
              <p className="text-sm text-primary-600 font-medium">{item.points} points</p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to {item.owner.name}
            </label>
            <textarea
              rows={4}
              value={swapMessage}
              onChange={(e) => setSwapMessage(e.target.value)}
              placeholder="Tell them why you'd like to swap and what you can offer..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSwapRequest}
              className="flex-1 btn-primary"
            >
              Send Request
            </button>
            <button
              onClick={() => setShowSwapModal(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 