import { Item, User, SwapRequest } from '../context/AppContext';

export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b75c?w=150&h=150&fit=crop&crop=face',
    email: 'emma@example.com',
    points: 450,
    joinDate: '2023-01-15',
    rating: 4.8,
    swapsCompleted: 28,
    itemsListed: 15,
    impactScore: 85,
    following: ['2', '3'],
    followers: ['4', '5', '6']
  },
  {
    id: '2',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    email: 'alex@example.com',
    points: 320,
    joinDate: '2023-02-20',
    rating: 4.6,
    swapsCompleted: 18,
    itemsListed: 12,
    impactScore: 72,
    following: ['1', '3'],
    followers: ['1', '4']
  },
  {
    id: '3',
    name: 'Sarah Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    email: 'sarah@example.com',
    points: 680,
    joinDate: '2022-11-10',
    rating: 4.9,
    swapsCompleted: 45,
    itemsListed: 22,
    impactScore: 95,
    following: ['1', '2', '4'],
    followers: ['1', '2', '5', '6']
  }
];

export const sampleItems: Item[] = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    description: 'Classic blue denim jacket in excellent condition. Perfect for layering and has that authentic vintage look.',
    category: 'Outerwear',
    size: 'M',
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=600&fit=crop'
    ],
    owner: sampleUsers[1],
    points: 35,
    tags: ['vintage', 'denim', 'casual', 'unisex'],
    dateAdded: '2024-01-10',
    location: 'San Francisco, CA',
    isFavorite: false
  },
  {
    id: '2',
    title: 'Floral Summer Dress',
    description: 'Beautiful floral print dress, perfect for summer occasions. Lightweight and comfortable with a flattering fit.',
    category: 'Dresses',
    size: 'S',
    condition: 'Very Good',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583496661160-fb5886a13d44?w=500&h=600&fit=crop'
    ],
    owner: sampleUsers[2],
    points: 28,
    tags: ['floral', 'summer', 'feminine', 'casual'],
    dateAdded: '2024-01-08',
    location: 'Los Angeles, CA',
    isFavorite: true
  },
  {
    id: '3',
    title: 'Designer Leather Boots',
    description: 'Authentic leather boots from a premium brand. Minimal wear, excellent quality and craftsmanship.',
    category: 'Shoes',
    size: '8',
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop'
    ],
    owner: sampleUsers[0],
    points: 45,
    tags: ['leather', 'designer', 'boots', 'premium'],
    dateAdded: '2024-01-05',
    location: 'New York, NY',
    isFavorite: false
  },
  {
    id: '4',
    title: 'Cozy Knit Sweater',
    description: 'Soft and warm knit sweater in neutral beige. Perfect for fall and winter layering.',
    category: 'Tops',
    size: 'L',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f37f4cf9?w=500&h=600&fit=crop'
    ],
    owner: sampleUsers[1],
    points: 22,
    tags: ['knit', 'cozy', 'winter', 'neutral'],
    dateAdded: '2024-01-03',
    location: 'Portland, OR',
    isFavorite: true
  },
  {
    id: '5',
    title: 'Slim Fit Jeans',
    description: 'Dark wash slim fit jeans in great condition. Classic style that goes with everything.',
    category: 'Bottoms',
    size: '32',
    condition: 'Very Good',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=600&fit=crop'
    ],
    owner: sampleUsers[2],
    points: 30,
    tags: ['jeans', 'slim-fit', 'dark-wash', 'classic'],
    dateAdded: '2024-01-01',
    location: 'Seattle, WA',
    isFavorite: false
  },
  {
    id: '6',
    title: 'Silk Scarf Collection',
    description: 'Set of 3 beautiful silk scarves in different patterns. Perfect for adding elegance to any outfit.',
    category: 'Accessories',
    size: 'One Size',
    condition: 'Excellent',
    images: [
      'https://images.unsplash.com/photo-1601897679825-9db1d0e41b3d?w=500&h=600&fit=crop',
      'https://images.unsplash.com/photo-1596498270416-c4ff2d2c9b5f?w=500&h=600&fit=crop'
    ],
    owner: sampleUsers[0],
    points: 25,
    tags: ['silk', 'accessories', 'elegant', 'set'],
    dateAdded: '2023-12-28',
    location: 'San Francisco, CA',
    isFavorite: true
  }
];

export const sampleSwapRequests: SwapRequest[] = [
  {
    id: '1',
    itemId: '2',
    requesterId: '1',
    ownerId: '3',
    status: 'pending',
    message: 'Hi! I love this dress and would love to swap for my vintage jacket or boots. Let me know!',
    dateCreated: '2024-01-12'
  },
  {
    id: '2',
    itemId: '4',
    requesterId: '3',
    ownerId: '2',
    status: 'accepted',
    message: 'This sweater would be perfect for my winter collection. Happy to swap!',
    dateCreated: '2024-01-11'
  },
  {
    id: '3',
    itemId: '1',
    requesterId: '2',
    ownerId: '1',
    status: 'completed',
    message: 'Great condition jacket! Thanks for the smooth swap.',
    dateCreated: '2024-01-09'
  }
];

export const categories = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Shoes',
  'Accessories'
];

export const sizes = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL',
  '6', '7', '8', '9', '10', '11', '12',
  '28', '30', '32', '34', '36', '38', '40'
];

export const conditions = [
  'Excellent',
  'Very Good',
  'Good',
  'Fair'
];

export const sustainabilityStats = {
  itemsSwapped: 12547,
  co2Saved: 8934, // in kg
  waterSaved: 156789, // in liters
  communityMembers: 15432
}; 