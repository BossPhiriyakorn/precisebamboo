// API Service สำหรับการเชื่อมต่อกับ Database
import { db, User, Booking, Factory, Article } from './database';

export class ApiService {
  // User API
  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = db.createUser(userData);
        resolve(user);
      }, 100); // Simulate network delay
    });
  }

  static async getUserById(id: string): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = db.getUserById(id);
        resolve(user || null);
      }, 100);
    });
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = db.getUserByEmail(email);
        resolve(user || null);
      }, 100);
    });
  }

  static async getUserByLineId(lineUserId: string): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = db.getUserByLineId(lineUserId);
        resolve(user || null);
      }, 100);
    });
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = db.updateUser(id, updates);
        resolve(user || null);
      }, 100);
    });
  }

  static async deleteUser(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = db.deleteUser(id);
        resolve(result);
      }, 100);
    });
  }

  static async getAllUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = db.getAllUsers();
        resolve(users);
      }, 100);
    });
  }

  static async getUsersByRole(role: 'farmer' | 'admin' | 'factory'): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = db.getUsersByRole(role);
        resolve(users);
      }, 100);
    });
  }

  // Booking API
  static async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = db.createBooking(bookingData);
        resolve(booking);
      }, 100);
    });
  }

  static async getBookingById(id: string): Promise<Booking | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = db.getBookingById(id);
        resolve(booking || null);
      }, 100);
    });
  }

  static async getBookingsByFarmerId(farmerId: string): Promise<Booking[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bookings = db.getBookingsByFarmerId(farmerId);
        resolve(bookings);
      }, 100);
    });
  }

  static async getBookingsByFactoryId(factoryId: string): Promise<Booking[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bookings = db.getBookingsByFactoryId(factoryId);
        resolve(bookings);
      }, 100);
    });
  }

  static async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = db.updateBooking(id, updates);
        resolve(booking || null);
      }, 100);
    });
  }

  static async deleteBooking(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = db.deleteBooking(id);
        resolve(result);
      }, 100);
    });
  }

  static async getAllBookings(): Promise<Booking[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bookings = db.getAllBookings();
        resolve(bookings);
      }, 100);
    });
  }

  // Factory API
  static async createFactory(factoryData: Omit<Factory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Factory> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const factory = db.createFactory(factoryData);
        resolve(factory);
      }, 100);
    });
  }

  static async getFactoryById(id: string): Promise<Factory | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const factory = db.getFactoryById(id);
        resolve(factory || null);
      }, 100);
    });
  }

  static async getAllFactories(): Promise<Factory[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const factories = db.getAllFactories();
        resolve(factories);
      }, 100);
    });
  }

  static async getActiveFactories(): Promise<Factory[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const factories = db.getActiveFactories();
        resolve(factories);
      }, 100);
    });
  }

  static async updateFactory(id: string, updates: Partial<Factory>): Promise<Factory | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const factory = db.updateFactory(id, updates);
        resolve(factory || null);
      }, 100);
    });
  }

  static async deleteFactory(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = db.deleteFactory(id);
        resolve(result);
      }, 100);
    });
  }

  // Article API
  static async createArticle(articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Promise<Article> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const article = db.createArticle(articleData);
        resolve(article);
      }, 100);
    });
  }

  static async getArticleById(id: string): Promise<Article | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const article = db.getArticleById(id);
        resolve(article || null);
      }, 100);
    });
  }

  static async getAllArticles(): Promise<Article[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const articles = db.getAllArticles();
        resolve(articles);
      }, 100);
    });
  }

  static async getPublishedArticles(): Promise<Article[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const articles = db.getPublishedArticles();
        resolve(articles);
      }, 100);
    });
  }

  static async getArticlesByCategory(category: string): Promise<Article[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const articles = db.getArticlesByCategory(category);
        resolve(articles);
      }, 100);
    });
  }

  static async updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const article = db.updateArticle(id, updates);
        resolve(article || null);
      }, 100);
    });
  }

  static async deleteArticle(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = db.deleteArticle(id);
        resolve(result);
      }, 100);
    });
  }

  // Utility API
  static async getStats(): Promise<{
    totalUsers: number;
    totalBookings: number;
    totalFactories: number;
    totalArticles: number;
    usersByRole: Record<string, number>;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = db.getStats();
        resolve(stats);
      }, 100);
    });
  }

  static async clearAllData(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        db.clearAllData();
        resolve();
      }, 100);
    });
  }
}

export default ApiService;
