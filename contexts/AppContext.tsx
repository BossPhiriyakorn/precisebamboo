// Context สำหรับการจัดการ State ของแอปพลิเคชัน
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Factory, Article } from '../services/database';
import { FarmerBooking, KnowledgeArticle } from '../types';
// import ApiService from '../services/apiService'; // ไม่ได้ใช้งานในขณะนี้
import * as mockData from '../data/mockData';
import { useMockData } from '../utils/environment';

// Types
interface AppState {
  currentUser: User | null;
  bookings: FarmerBooking[];
  factories: Factory[];
  articles: KnowledgeArticle[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_BOOKINGS'; payload: FarmerBooking[] }
  | { type: 'ADD_BOOKING'; payload: FarmerBooking }
  | { type: 'UPDATE_BOOKING'; payload: FarmerBooking }
  | { type: 'DELETE_BOOKING'; payload: string }
  | { type: 'SET_FACTORIES'; payload: Factory[] }
  | { type: 'ADD_FACTORY'; payload: Factory }
  | { type: 'UPDATE_FACTORY'; payload: Factory }
  | { type: 'DELETE_FACTORY'; payload: string }
  | { type: 'SET_ARTICLES'; payload: KnowledgeArticle[] }
  | { type: 'ADD_ARTICLE'; payload: KnowledgeArticle }
  | { type: 'UPDATE_ARTICLE'; payload: KnowledgeArticle }
  | { type: 'DELETE_ARTICLE'; payload: string }
  | { type: 'CLEAR_ALL_DATA' };

// Initial state
const initialState: AppState = {
  currentUser: null,
  bookings: useMockData ? mockData.farmerBookings : [],
  factories: useMockData ? [] : [], // ไม่มี factories ใน mockData
  articles: useMockData ? mockData.knowledgeArticles : [],
  loading: false,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload };
    case 'ADD_BOOKING':
      return { ...state, bookings: [...state.bookings, action.payload] };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id ? action.payload : booking
        ),
      };
    case 'DELETE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking.id !== action.payload),
      };
    case 'SET_FACTORIES':
      return { ...state, factories: action.payload };
    case 'ADD_FACTORY':
      return { ...state, factories: [...state.factories, action.payload] };
    case 'UPDATE_FACTORY':
      return {
        ...state,
        factories: state.factories.map(factory =>
          factory.id === action.payload.id ? action.payload : factory
        ),
      };
    case 'DELETE_FACTORY':
      return {
        ...state,
        factories: state.factories.filter(factory => factory.id !== action.payload),
      };
    case 'SET_ARTICLES':
      return { ...state, articles: action.payload };
    case 'ADD_ARTICLE':
      return { ...state, articles: [...state.articles, action.payload] };
    case 'UPDATE_ARTICLE':
      return {
        ...state,
        articles: state.articles.map(article =>
          article.id === action.payload.id ? action.payload : article
        ),
      };
    case 'DELETE_ARTICLE':
      return {
        ...state,
        articles: state.articles.filter(article => article.id !== action.payload),
      };
    case 'CLEAR_ALL_DATA':
      return initialState;
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  loginWithLine: (lineUserId: string) => Promise<boolean>;
  logout: () => void;
  loadUserData: (userId: string) => Promise<void>;
  loadBookings: (userId: string) => Promise<void>;
  loadFactories: () => Promise<void>;
  loadArticles: () => Promise<void>;
  createBooking: (bookingData: Omit<FarmerBooking, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateBooking: (id: string, updates: Partial<FarmerBooking>) => Promise<boolean>;
  deleteBooking: (id: string) => Promise<boolean>;
  createFactory: (factoryData: Omit<Factory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateFactory: (id: string, updates: Partial<Factory>) => Promise<boolean>;
  deleteFactory: (id: string) => Promise<boolean>;
  createArticle: (articleData: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateArticle: (id: string, updates: Partial<KnowledgeArticle>) => Promise<boolean>;
  deleteArticle: (id: string) => Promise<boolean>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // const user = await ApiService.getUserByEmail(email);
      const user = null; // Mock data for now
      if (user && user.password === password) {
        dispatch({ type: 'SET_CURRENT_USER', payload: user });
        await loadUserData(user.id);
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการล็อกอิน' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loginWithLine = async (lineUserId: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // const user = await ApiService.getUserByLineId(lineUserId);
      const user = null; // Mock data for now
      if (user) {
        dispatch({ type: 'SET_CURRENT_USER', payload: user });
        await loadUserData(user.id);
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการล็อกอิน LINE' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
  };

  const loadUserData = async (userId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (useMockData) {
        // ใน development mode ใช้ mock data
        dispatch({ type: 'SET_BOOKINGS', payload: mockData.farmerBookings });
        dispatch({ type: 'SET_FACTORIES', payload: [] }); // ไม่มี factories ใน mockData
        dispatch({ type: 'SET_ARTICLES', payload: mockData.knowledgeArticles });
      } else {
        // ใน production mode ใช้ database (currently disabled)
        // const [bookings, factories, articles] = await Promise.all([
        //   ApiService.getBookingsByFarmerId(userId),
        //   ApiService.getAllFactories(),
        //   ApiService.getPublishedArticles()
        // ]);

        // dispatch({ type: 'SET_BOOKINGS', payload: bookings });
        // dispatch({ type: 'SET_FACTORIES', payload: factories });
        // dispatch({ type: 'SET_ARTICLES', payload: articles });
        
        // Fallback to mock data for now
        dispatch({ type: 'SET_BOOKINGS', payload: mockData.farmerBookings });
        dispatch({ type: 'SET_FACTORIES', payload: [] });
        dispatch({ type: 'SET_ARTICLES', payload: mockData.knowledgeArticles });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการโหลดข้อมูล' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadBookings = async (userId: string): Promise<void> => {
    try {
      if (useMockData) {
        dispatch({ type: 'SET_BOOKINGS', payload: mockData.farmerBookings });
      } else {
        // const bookings = await ApiService.getBookingsByFarmerId(userId);
      const bookings = mockData.farmerBookings; // Mock data
        dispatch({ type: 'SET_BOOKINGS', payload: bookings });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง' });
    }
  };

  const loadFactories = async (): Promise<void> => {
    try {
      if (useMockData) {
        dispatch({ type: 'SET_FACTORIES', payload: [] }); // ไม่มี factories ใน mockData
      } else {
        // const factories = await ApiService.getAllFactories();
        const factories = []; // Mock data
        dispatch({ type: 'SET_FACTORIES', payload: factories });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการโหลดข้อมูลโรงงาน' });
    }
  };

  const loadArticles = async (): Promise<void> => {
    try {
      if (useMockData) {
        dispatch({ type: 'SET_ARTICLES', payload: mockData.knowledgeArticles });
      } else {
        // const articles = await ApiService.getPublishedArticles();
        const articles = mockData.knowledgeArticles; // Mock data
        dispatch({ type: 'SET_ARTICLES', payload: articles });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการโหลดข้อมูลบทความ' });
    }
  };

  const createBooking = async (bookingData: Omit<FarmerBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      // const booking = await ApiService.createBooking(bookingData);
      const booking = { ...bookingData, id: Date.now().toString() } as FarmerBooking; // Mock
      dispatch({ type: 'ADD_BOOKING', payload: booking });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการสร้างการจอง' });
      return false;
    }
  };

  const updateBooking = async (id: string, updates: Partial<FarmerBooking>): Promise<boolean> => {
    try {
      // const booking = await ApiService.updateBooking(id, updates);
      const booking = { ...updates, id } as FarmerBooking; // Mock
      if (booking) {
        dispatch({ type: 'UPDATE_BOOKING', payload: booking });
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการอัปเดตการจอง' });
      return false;
    }
  };

  const deleteBooking = async (id: string): Promise<boolean> => {
    try {
      // const result = await ApiService.deleteBooking(id);
      const result = true; // Mock
      if (result) {
        dispatch({ type: 'DELETE_BOOKING', payload: id });
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการลบการจอง' });
      return false;
    }
  };

  const createFactory = async (factoryData: Omit<Factory, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      // const factory = await ApiService.createFactory(factoryData);
      const factory = { ...factoryData, id: Date.now().toString() } as Factory; // Mock
      dispatch({ type: 'ADD_FACTORY', payload: factory });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการสร้างโรงงาน' });
      return false;
    }
  };

  const updateFactory = async (id: string, updates: Partial<Factory>): Promise<boolean> => {
    try {
      // const factory = await ApiService.updateFactory(id, updates);
      const factory = { ...updates, id } as Factory; // Mock
      if (factory) {
        dispatch({ type: 'UPDATE_FACTORY', payload: factory });
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการอัปเดตโรงงาน' });
      return false;
    }
  };

  const deleteFactory = async (id: string): Promise<boolean> => {
    try {
      // const result = await ApiService.deleteFactory(id);
      const result = true; // Mock
      if (result) {
        dispatch({ type: 'DELETE_FACTORY', payload: id });
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการลบโรงงาน' });
      return false;
    }
  };

  const createArticle = async (articleData: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      // const article = await ApiService.createArticle(articleData);
      const article = { ...articleData, id: Date.now().toString() } as KnowledgeArticle; // Mock
      dispatch({ type: 'ADD_ARTICLE', payload: article });
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการสร้างบทความ' });
      return false;
    }
  };

  const updateArticle = async (id: string, updates: Partial<KnowledgeArticle>): Promise<boolean> => {
    try {
      // const article = await ApiService.updateArticle(id, updates);
      const article = { ...updates, id } as KnowledgeArticle; // Mock
      if (article) {
        dispatch({ type: 'UPDATE_ARTICLE', payload: article });
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการอัปเดตบทความ' });
      return false;
    }
  };

  const deleteArticle = async (id: string): Promise<boolean> => {
    try {
      // const result = await ApiService.deleteArticle(id);
      const result = true; // Mock
      if (result) {
        dispatch({ type: 'DELETE_ARTICLE', payload: id });
        return true;
      }
      return false;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'เกิดข้อผิดพลาดในการลบบทความ' });
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        login,
        loginWithLine,
        logout,
        loadUserData,
        loadBookings,
        loadFactories,
        loadArticles,
        createBooking,
        updateBooking,
        deleteBooking,
        createFactory,
        updateFactory,
        deleteFactory,
        createArticle,
        updateArticle,
        deleteArticle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
