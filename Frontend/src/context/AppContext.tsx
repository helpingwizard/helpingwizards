import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { authApi, itemsApi, swapsApi } from '../api';

export interface User {
  id: number;
  name: string;
  avatar?: string;
  email: string;
  points: number;
  join_date: string;
  rating: number;
  swaps_completed: number;
  items_listed: number;
  impact_score: number;
  location?: string;
  following?: string[];
  followers?: string[];
}

export interface Item {
  id: number;
  title: string;
  description?: string;
  category?: string;
  size?: string;
  condition?: string;
  images?: string[];
  owner_id: number;
  points?: number;
  tags?: string;
  date_added: string;
  location?: string;
  status: 'available' | 'pending' | 'swapped' | 'rejected';
  isFavorite: boolean;
}

export interface SwapRequest {
  id: number;
  item_id: number;
  requester_id: number;
  owner_id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  date_created: string;
}

interface AppState {
  user: User | null;
  items: Item[];
  swapRequests: SwapRequest[];
  favorites: number[];
  searchFilters: {
    category: string;
    size: string;
    condition: string;
    location: string;
    query: string;
  };
  loading: boolean;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ITEMS'; payload: Item[] }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: { id: number; updates: Partial<Item> } }
  | { type: 'DELETE_ITEM'; payload: number }
  | { type: 'SET_SWAP_REQUESTS'; payload: SwapRequest[] }
  | { type: 'ADD_SWAP_REQUEST'; payload: SwapRequest }
  | { type: 'UPDATE_SWAP_REQUEST'; payload: { id: number; updates: Partial<SwapRequest> } }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'SET_SEARCH_FILTERS'; payload: Partial<AppState['searchFilters']> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
  user: null,
  items: [],
  swapRequests: [],
  favorites: [],
  searchFilters: {
    category: '',
    size: '',
    condition: '',
    location: '',
    query: ''
  },
  loading: false,
  error: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
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
    case 'SET_SWAP_REQUESTS':
      return { ...state, swapRequests: action.payload };
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
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: (action: AppAction) => void;
  loadItems: () => Promise<void>;
  loadSwapRequests: () => Promise<void>;
  createItem: (itemData: any) => Promise<void>;
  createSwapRequest: (swapData: any) => Promise<void>;
  acceptSwapRequest: (swapId: number) => Promise<void>;
  rejectSwapRequest: (swapId: number) => Promise<void>;
  refreshUserData: () => Promise<void>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load user data on mount if authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (authApi.isAuthenticated()) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const user = await authApi.getCurrentUser();
          dispatch({ type: 'SET_USER', payload: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            email: user.email,
            points: user.points,
            join_date: user.join_date,
            rating: user.rating,
            swaps_completed: user.swaps_completed,
            items_listed: user.items_listed,
            impact_score: user.impact_score,
            location: user.location,
          }});
        } catch (error) {
          console.error('Failed to load user data:', error);
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };

    loadUserData();
  }, []);

  // API integration functions
  const refreshUserData = async () => {
    if (authApi.isAuthenticated()) {
      try {
        const user = await authApi.getCurrentUser();
        dispatch({ type: 'SET_USER', payload: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          email: user.email,
          points: user.points,
          join_date: user.join_date,
          rating: user.rating,
          swaps_completed: user.swaps_completed,
          items_listed: user.items_listed,
          impact_score: user.impact_score,
          location: user.location,
        }});
      } catch (error) {
        console.error('Failed to refresh user data:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh user data' });
      }
    }
  };

  const apiActions = {
    async loadItems() {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const items = await itemsApi.getAll();
        dispatch({ type: 'SET_ITEMS', payload: items.map(item => ({
          ...item,
          isFavorite: state.favorites.includes(item.id)
        })) });
      } catch (error) {
        console.error('Failed to load items:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load items' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    async loadSwapRequests() {
      try {
        const swaps = await swapsApi.getAll();
        dispatch({ type: 'SET_SWAP_REQUESTS', payload: swaps });
      } catch (error) {
        console.error('Failed to load swap requests:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load swap requests' });
      }
    },

    async createItem(itemData: any) {
      try {
        const newItem = await itemsApi.create(itemData);
        dispatch({ type: 'ADD_ITEM', payload: { ...newItem, isFavorite: false } });
      } catch (error) {
        console.error('Failed to create item:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to create item' });
      }
    },

    async createSwapRequest(swapData: any) {
      try {
        const newSwap = await swapsApi.create(swapData);
        dispatch({ type: 'ADD_SWAP_REQUEST', payload: newSwap });
      } catch (error) {
        console.error('Failed to create swap request:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to create swap request' });
      }
    },

    async acceptSwapRequest(swapId: number) {
      try {
        const updatedSwap = await swapsApi.accept(swapId);
        dispatch({ type: 'UPDATE_SWAP_REQUEST', payload: { id: swapId, updates: updatedSwap } });
        // Refresh user data to get updated stats
        await refreshUserData();
      } catch (error) {
        console.error('Failed to accept swap request:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to accept swap request' });
      }
    },

    async rejectSwapRequest(swapId: number) {
      try {
        const updatedSwap = await swapsApi.reject(swapId);
        dispatch({ type: 'UPDATE_SWAP_REQUEST', payload: { id: swapId, updates: updatedSwap } });
      } catch (error) {
        console.error('Failed to reject swap request:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to reject swap request' });
      }
    },

    refreshUserData,
  };

  return (
    <AppContext.Provider value={{ state, dispatch, ...apiActions }}>
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