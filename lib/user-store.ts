// Simple in-memory user storage
// In production, this should be replaced with a database

export interface User {
  id: string;
  email: string;
  createdAt: number;
  verified: boolean;
  role: 'user' | 'admin';
  profile?: {
    fullName?: string;
    phone?: string;
  };
  orders?: string[]; // Order IDs
}

export interface UserSession {
  userId: string;
  email: string;
  sessionId: string;
  expiresAt: number;
  createdAt: number;
}

// Global in-memory stores
const userStore = new Map<string, User>();
const emailToUserMap = new Map<string, string>(); // email -> userId
const sessionStore = new Map<string, UserSession>();

export const UserStore = {
  // User management
  create: (email: string): User => {
    const userId = generateUserId();
    const user: User = {
      id: userId,
      email,
      createdAt: Date.now(),
      verified: true, // Since they completed email verification
      role: email === 'cmd@hopehospital.com' ? 'admin' : 'user', // Hardcoded admin email
      orders: []
    };
    
    userStore.set(userId, user);
    emailToUserMap.set(email, userId);
    
    return user;
  },
  
  getById: (userId: string): User | undefined => {
    return userStore.get(userId);
  },
  
  getByEmail: (email: string): User | undefined => {
    const userId = emailToUserMap.get(email);
    return userId ? userStore.get(userId) : undefined;
  },
  
  update: (userId: string, updates: Partial<User>): User | undefined => {
    const user = userStore.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    userStore.set(userId, updatedUser);
    return updatedUser;
  },
  
  delete: (userId: string): boolean => {
    const user = userStore.get(userId);
    if (!user) return false;
    
    emailToUserMap.delete(user.email);
    return userStore.delete(userId);
  },
  
  getAllForDev: (): Array<[string, User]> => {
    return Array.from(userStore.entries());
  },

  // Admin functions
  isAdmin: (userId: string): boolean => {
    const user = userStore.get(userId);
    return user?.role === 'admin' || false;
  },

  isAdminByEmail: (email: string): boolean => {
    return email === 'cmd@hopehospital.com';
  },

  // Initialize admin user if it doesn't exist
  initializeAdmin: (): void => {
    const adminEmail = 'cmd@hopehospital.com';
    const existingUser = UserStore.getByEmail(adminEmail);
    
    if (!existingUser) {
      const adminUser = UserStore.create(adminEmail);
      console.log(`✅ Admin user created: ${adminUser.id} for ${adminEmail}`);
    } else {
      console.log(`✅ Admin user already exists: ${existingUser.id} for ${adminEmail}`);
    }
  },

  // Session management
  createSession: (userId: string, email: string): UserSession => {
    const sessionId = generateSessionId();
    const session: UserSession = {
      userId,
      email,
      sessionId,
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: Date.now()
    };
    
    sessionStore.set(sessionId, session);
    return session;
  },
  
  getSession: (sessionId: string): UserSession | undefined => {
    const session = sessionStore.get(sessionId);
    if (!session) return undefined;
    
    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      sessionStore.delete(sessionId);
      return undefined;
    }
    
    return session;
  },
  
  deleteSession: (sessionId: string): boolean => {
    return sessionStore.delete(sessionId);
  },
  
  // Utility methods
  addOrderToUser: (userId: string, orderId: string): boolean => {
    const user = userStore.get(userId);
    if (!user) return false;
    
    if (!user.orders) {
      user.orders = [];
    }
    
    user.orders.push(orderId);
    userStore.set(userId, user);
    return true;
  },
  
  getUserOrders: (userId: string): string[] => {
    const user = userStore.get(userId);
    return user?.orders || [];
  },
  
  cleanExpiredSessions: (): number => {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [sessionId, session] of sessionStore.entries()) {
      if (now > session.expiresAt) {
        sessionStore.delete(sessionId);
        cleaned++;
      }
    }
    
    return cleaned;
  }
};

// Generate unique user ID
function generateUserId(): string {
  return `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate unique session ID
function generateSessionId(): string {
  return `ses_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}