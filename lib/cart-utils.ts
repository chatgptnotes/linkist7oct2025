// Cart utilities with safe localStorage handling
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  config?: any;
}

export interface StorageResult {
  success: boolean;
  error?: string;
}

// Safe localStorage operations with quota handling
export const safeLocalStorage = {
  setItem: (key: string, value: any): StorageResult => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return { success: true };
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, attempting cleanup...');
        
        // Clear non-essential data first
        const keysToCleanup = ['cartItems', 'cardConfig', 'userPreferences'];
        
        for (const cleanupKey of keysToCleanup) {
          if (cleanupKey !== key) {
            localStorage.removeItem(cleanupKey);
          }
        }
        
        // Try again after cleanup
        try {
          localStorage.setItem(key, JSON.stringify(value));
          console.log('Successfully saved after localStorage cleanup');
          return { success: true };
        } catch (retryError) {
          console.error('Still failed after cleanup:', retryError);
          return { 
            success: false, 
            error: 'Storage quota exceeded even after cleanup. Please clear your browser data.' 
          };
        }
      }
      
      console.error('localStorage error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Storage error' 
      };
    }
  },

  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

// Cart-specific utilities
export const cartUtils = {
  getCartItems: (): CartItem[] => {
    return safeLocalStorage.getItem<CartItem[]>('cartItems', []);
  },

  addToCart: (item: CartItem): StorageResult => {
    const cartItems = cartUtils.getCartItems();
    
    // Check for duplicates based on config similarity
    const existingItemIndex = cartItems.findIndex((existingItem) => {
      if (!existingItem.config || !item.config) return false;
      
      return (
        existingItem.config.firstName === item.config.firstName &&
        existingItem.config.lastName === item.config.lastName &&
        existingItem.config.company === item.config.company
      );
    });
    
    if (existingItemIndex !== -1) {
      // Update existing item quantity
      cartItems[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      cartItems.push(item);
    }
    
    return safeLocalStorage.setItem('cartItems', cartItems);
  },

  updateCartItem: (id: number, updates: Partial<CartItem>): StorageResult => {
    const cartItems = cartUtils.getCartItems();
    const itemIndex = cartItems.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
      cartItems[itemIndex] = { ...cartItems[itemIndex], ...updates };
      return safeLocalStorage.setItem('cartItems', cartItems);
    }
    
    return { success: false, error: 'Item not found in cart' };
  },

  removeFromCart: (id: number): StorageResult => {
    const cartItems = cartUtils.getCartItems();
    const filteredItems = cartItems.filter(item => item.id !== id);
    return safeLocalStorage.setItem('cartItems', filteredItems);
  },

  clearCart: (): void => {
    safeLocalStorage.removeItem('cartItems');
  },

  getCartTotal: (): number => {
    const cartItems = cartUtils.getCartItems();
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getCartItemCount: (): number => {
    const cartItems = cartUtils.getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }
};

// Storage health check and cleanup
export const storageHealth = {
  checkQuota: (): { available: boolean; usage?: number; limit?: number } => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      return navigator.storage.estimate().then(estimate => ({
        available: true,
        usage: estimate.usage,
        limit: estimate.quota
      })).catch(() => ({ available: false }));
    }
    
    // Fallback test
    try {
      const testKey = '__storage_test__';
      const testValue = 'test';
      localStorage.setItem(testKey, testValue);
      localStorage.removeItem(testKey);
      return { available: true };
    } catch {
      return { available: false };
    }
  },

  cleanup: (): void => {
    console.log('Performing localStorage cleanup...');
    
    // Remove old or expired data
    const keysToCheck = Object.keys(localStorage);
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    keysToCheck.forEach(key => {
      if (key.startsWith('temp_') || key.includes('cache_')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('localStorage cleanup completed');
  }
};