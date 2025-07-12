import { createContext, useContext, useReducer, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  points: number;
  joinDate: string;
  rating: number;
  swapsCompleted: number;
  itemsListed: number;
  impactScore: number;
  following: string[];
  followers: string[];
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  images: string[];
  owner: User;
  points: number;
  tags: string[];
  dateAdded: string;
  location: string;
  isFavorite: boolean;
}

export interface SwapRequest {
  id: string;
  itemId: string;
  requesterId: string;
  ownerId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message: string;
  dateCreated: string;
}

interface AppState {
  user: User | null;
  items: Item[];
  swapRequests: SwapRequest[];
  favorites: string[];
  searchFilters: {
    category: string;
    size: string;
    condition: string;
    location: string;
    query: string;
  };
}

type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: { id: string; updates: Partial<Item> } }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'ADD_SWAP_REQUEST'; payload: SwapRequest }
  | { type: 'UPDATE_SWAP_REQUEST'; payload: { id: string; updates: Partial<SwapRequest> } }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_SEARCH_FILTERS'; payload: Partial<AppState['searchFilters']> };

const initialState: AppState = {
  user: {
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
  items: [],
  swapRequests: [],
  favorites: [],
  searchFilters: {
    category: '',
    size: '',
    condition: '',
    location: '',
    query: ''
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        )
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'ADD_SWAP_REQUEST':
      return { ...state, swapRequests: [...state.swapRequests, action.payload] };
    case 'UPDATE_SWAP_REQUEST':
      return {
        ...state,
        swapRequests: state.swapRequests.map(request =>
          request.id === action.payload.id ? { ...request, ...action.payload.updates } : request
        )
      };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload]
      };
    case 'SET_SEARCH_FILTERS':
      return {
        ...state,
        searchFilters: { ...state.searchFilters, ...action.payload }
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 