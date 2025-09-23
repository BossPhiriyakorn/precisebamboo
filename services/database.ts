// In-Memory Database สำหรับการทดสอบ
// ข้อมูลจะถูกเก็บใน RAM และลบอัตโนมัติเมื่อ restart

export interface User {
  id: string;
  role: 'farmer' | 'admin' | 'factory';
  email?: string;
  password?: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    province: string;
    district: string;
    subDistrict: string;
    postalCode: string;
    lineUserId?: string;
    lineDisplayName?: string;
    linePictureUrl?: string;
  };
  isRegistered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  farmerId: string;
  factoryId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type: 'seedling' | 'cutting';
  quantity: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Factory {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  capacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// In-Memory Database
class InMemoryDatabase {
  private users: Map<string, User> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private factories: Map<string, Factory> = new Map();
  private articles: Map<string, Article> = new Map();

  constructor() {
    this.initializeSampleData();
  }

  // Initialize sample data for testing
  private initializeSampleData() {
    // Sample Users
    this.users.set('farmer-1', {
      id: 'farmer-1',
      role: 'farmer',
      profile: {
        firstName: 'สมชาย',
        lastName: 'ใจดี',
        phone: '081-234-5678',
        address: '123 หมู่ 1',
        province: 'กรุงเทพมหานคร',
        district: 'บางรัก',
        subDistrict: 'สุริยวงศ์',
        postalCode: '10500',
        lineUserId: 'U1234567890',
        lineDisplayName: 'สมชาย ใจดี',
        linePictureUrl: 'https://via.placeholder.com/150'
      },
      isRegistered: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.users.set('admin-1', {
      id: 'admin-1',
      role: 'admin',
      email: 'admin@bamboo.com',
      password: 'admin123',
      profile: {
        firstName: 'แอดมิน',
        lastName: 'ระบบ',
        phone: '081-111-1111',
        address: '456 หมู่ 2',
        province: 'กรุงเทพมหานคร',
        district: 'สาทร',
        subDistrict: 'ทุ่งมหาเมฆ',
        postalCode: '10120'
      },
      isRegistered: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.users.set('factory-1', {
      id: 'factory-1',
      role: 'factory',
      email: 'factory@bamboo.com',
      password: 'factory123',
      profile: {
        firstName: 'โรงงาน',
        lastName: 'แปรรูปไผ่',
        phone: '081-222-2222',
        address: '789 หมู่ 3',
        province: 'นครปฐม',
        district: 'เมืองนครปฐม',
        subDistrict: 'พระปฐมเจดีย์',
        postalCode: '73000'
      },
      isRegistered: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Sample Factories
    this.factories.set('factory-1', {
      id: 'factory-1',
      name: 'โรงงานแปรรูปไผ่แห่งแรก',
      address: '789 หมู่ 3 ตำบลพระปฐมเจดีย์ อำเภอเมืองนครปฐม จังหวัดนครปฐม 73000',
      phone: '081-222-2222',
      email: 'factory@bamboo.com',
      capacity: 1000,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.factories.set('factory-2', {
      id: 'factory-2',
      name: 'โรงงานแปรรูปไผ่แห่งที่สอง',
      address: '321 หมู่ 4 ตำบลบางปะกง อำเภอบางปะกง จังหวัดฉะเชิงเทรา 24110',
      phone: '081-333-3333',
      email: 'factory2@bamboo.com',
      capacity: 800,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Sample Bookings
    this.bookings.set('booking-1', {
      id: 'booking-1',
      farmerId: 'farmer-1',
      factoryId: 'factory-1',
      date: '2024-01-15',
      time: '09:00',
      status: 'confirmed',
      type: 'seedling',
      quantity: 100,
      notes: 'ต้องการต้นกล้าไผ่สำหรับปลูกใหม่',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.bookings.set('booking-2', {
      id: 'booking-2',
      farmerId: 'farmer-1',
      factoryId: 'factory-1',
      date: '2024-01-20',
      time: '14:00',
      status: 'pending',
      type: 'cutting',
      quantity: 50,
      notes: 'ต้องการตัดไผ่สำหรับขาย',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Sample Articles
    this.articles.set('article-1', {
      id: 'article-1',
      title: 'วิธีการปลูกไผ่ให้ได้ผลดี',
      content: 'การปลูกไผ่ต้องเตรียมดินให้ดี ใส่ปุ๋ยอินทรีย์ และรดน้ำสม่ำเสมอ...',
      author: 'admin-1',
      category: 'การปลูก',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.articles.set('article-2', {
      id: 'article-2',
      title: 'เทคนิคการตัดไผ่',
      content: 'การตัดไผ่ต้องใช้เครื่องมือที่เหมาะสม และตัดในเวลาที่ถูกต้อง...',
      author: 'admin-1',
      category: 'การดูแล',
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // User operations
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const id = `${user.role}-${Date.now()}`;
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  getUserByEmail(email: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  getUserByLineId(lineUserId: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.profile.lineUserId === lineUserId) {
        return user;
      }
    }
    return undefined;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: new Date()
      };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUsersByRole(role: 'farmer' | 'admin' | 'factory'): User[] {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  // Booking operations
  createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Booking {
    const id = `booking-${Date.now()}`;
    const newBooking: Booking = {
      ...booking,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.get(id);
  }

  getBookingsByFarmerId(farmerId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(booking => booking.farmerId === farmerId);
  }

  getBookingsByFactoryId(factoryId: string): Booking[] {
    return Array.from(this.bookings.values()).filter(booking => booking.factoryId === factoryId);
  }

  updateBooking(id: string, updates: Partial<Booking>): Booking | undefined {
    const booking = this.bookings.get(id);
    if (booking) {
      const updatedBooking = {
        ...booking,
        ...updates,
        updatedAt: new Date()
      };
      this.bookings.set(id, updatedBooking);
      return updatedBooking;
    }
    return undefined;
  }

  deleteBooking(id: string): boolean {
    return this.bookings.delete(id);
  }

  getAllBookings(): Booking[] {
    return Array.from(this.bookings.values());
  }

  // Factory operations
  createFactory(factory: Omit<Factory, 'id' | 'createdAt' | 'updatedAt'>): Factory {
    const id = `factory-${Date.now()}`;
    const newFactory: Factory = {
      ...factory,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.factories.set(id, newFactory);
    return newFactory;
  }

  getFactoryById(id: string): Factory | undefined {
    return this.factories.get(id);
  }

  getAllFactories(): Factory[] {
    return Array.from(this.factories.values());
  }

  getActiveFactories(): Factory[] {
    return Array.from(this.factories.values()).filter(factory => factory.isActive);
  }

  updateFactory(id: string, updates: Partial<Factory>): Factory | undefined {
    const factory = this.factories.get(id);
    if (factory) {
      const updatedFactory = {
        ...factory,
        ...updates,
        updatedAt: new Date()
      };
      this.factories.set(id, updatedFactory);
      return updatedFactory;
    }
    return undefined;
  }

  deleteFactory(id: string): boolean {
    return this.factories.delete(id);
  }

  // Article operations
  createArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Article {
    const id = `article-${Date.now()}`;
    const newArticle: Article = {
      ...article,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.articles.set(id, newArticle);
    return newArticle;
  }

  getArticleById(id: string): Article | undefined {
    return this.articles.get(id);
  }

  getAllArticles(): Article[] {
    return Array.from(this.articles.values());
  }

  getPublishedArticles(): Article[] {
    return Array.from(this.articles.values()).filter(article => article.isPublished);
  }

  getArticlesByCategory(category: string): Article[] {
    return Array.from(this.articles.values()).filter(article => 
      article.category === category && article.isPublished
    );
  }

  updateArticle(id: string, updates: Partial<Article>): Article | undefined {
    const article = this.articles.get(id);
    if (article) {
      const updatedArticle = {
        ...article,
        ...updates,
        updatedAt: new Date()
      };
      this.articles.set(id, updatedArticle);
      return updatedArticle;
    }
    return undefined;
  }

  deleteArticle(id: string): boolean {
    return this.articles.delete(id);
  }

  // Utility methods
  clearAllData(): void {
    this.users.clear();
    this.bookings.clear();
    this.factories.clear();
    this.articles.clear();
    this.initializeSampleData();
  }

  getStats(): {
    totalUsers: number;
    totalBookings: number;
    totalFactories: number;
    totalArticles: number;
    usersByRole: Record<string, number>;
  } {
    const users = Array.from(this.users.values());
    const usersByRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalUsers: this.users.size,
      totalBookings: this.bookings.size,
      totalFactories: this.factories.size,
      totalArticles: this.articles.size,
      usersByRole
    };
  }
}

// Export singleton instance
export const db = new InMemoryDatabase();
