import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, Coins } from 'lucide-react';
import { Item } from '../context/AppContext';
import { useApp } from '../context/AppContext';

interface ItemCardProps {
  item: Item;
  showOwner?: boolean;
}

export default function ItemCard({ item, showOwner = true }: ItemCardProps) {
  const { dispatch } = useApp();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: 'TOGGLE_FAVORITE', payload: item.id });
  };

  return (
    <Link to={`/item/${item.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Image */}
        <div className="relative aspect-w-4 aspect-h-3 bg-gray-200">
          <img
            src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder-image.jpg'}
            alt={item.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors duration-200"
          >
            <Heart
              className={`h-4 w-4 ${
                item.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>
          
          {/* Condition Badge */}
          <div className="absolute top-2 left-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              item.condition === 'Excellent' ? 'bg-green-100 text-green-800' :
              item.condition === 'Very Good' ? 'bg-blue-100 text-blue-800' :
              item.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {item.condition}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-2">
            {item.title}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              {item.category} • Size {item.size}
            </span>
            <div className="flex items-center space-x-1 text-primary-600">
              <Coins className="h-4 w-4" />
              <span className="text-sm font-medium">{item.points} pts</span>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{item.location}</span>
          </div>

          {showOwner && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-600">U</span>
                </div>
                <span className="text-sm text-gray-600">Owner #{item.owner_id}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">5.0</span>
              </div>
            </div>
          )}

          {/* Tags */}
          {item.tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.split(',').slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag.trim()}
                </span>
              ))}
              {item.tags.split(',').length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  +{item.tags.split(',').length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 