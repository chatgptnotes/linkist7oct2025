// GDPR compliance data store
// In production, this should be replaced with a database

export interface ConsentRecord {
  email: string;
  consentGiven: boolean;
  consentDate: number;
  ipAddress?: string;
  userAgent?: string;
  purposes: {
    marketing: boolean;
    analytics: boolean;
    essential: boolean;
  };
  updatedAt: number;
}

export interface DataRequest {
  id: string;
  email: string;
  type: 'export' | 'deletion';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestDate: number;
  completedDate?: number;
  notes?: string;
}

// Global in-memory stores - replace with database in production
const consentStore = new Map<string, ConsentRecord>();
const dataRequestStore = new Map<string, DataRequest>();

export const GDPRStore = {
  // Consent management
  recordConsent: (consent: Omit<ConsentRecord, 'updatedAt'>): ConsentRecord => {
    const record: ConsentRecord = {
      ...consent,
      updatedAt: Date.now(),
    };
    
    consentStore.set(consent.email, record);
    return record;
  },

  getConsent: (email: string): ConsentRecord | undefined => {
    return consentStore.get(email);
  },

  hasValidConsent: (email: string, purpose?: keyof ConsentRecord['purposes']): boolean => {
    const consent = consentStore.get(email);
    if (!consent || !consent.consentGiven) return false;
    
    if (purpose) {
      return consent.purposes[purpose];
    }
    
    return true;
  },

  updateConsent: (email: string, updates: Partial<ConsentRecord>): ConsentRecord | undefined => {
    const existing = consentStore.get(email);
    if (!existing) return undefined;

    const updated: ConsentRecord = {
      ...existing,
      ...updates,
      updatedAt: Date.now(),
    };

    consentStore.set(email, updated);
    return updated;
  },

  withdrawConsent: (email: string): boolean => {
    const existing = consentStore.get(email);
    if (!existing) return false;

    const updated: ConsentRecord = {
      ...existing,
      consentGiven: false,
      purposes: {
        marketing: false,
        analytics: false,
        essential: true, // Essential cookies/processing remain
      },
      updatedAt: Date.now(),
    };

    consentStore.set(email, updated);
    return true;
  },

  // Data requests (export/deletion)
  createDataRequest: (request: Omit<DataRequest, 'id' | 'requestDate' | 'status'>): DataRequest => {
    const id = 'req_' + Math.random().toString(36).substring(2, 15);
    
    const dataRequest: DataRequest = {
      ...request,
      id,
      status: 'pending',
      requestDate: Date.now(),
    };

    dataRequestStore.set(id, dataRequest);
    return dataRequest;
  },

  getDataRequest: (id: string): DataRequest | undefined => {
    return dataRequestStore.get(id);
  },

  getDataRequestsByEmail: (email: string): DataRequest[] => {
    return Array.from(dataRequestStore.values())
      .filter(request => request.email === email)
      .sort((a, b) => b.requestDate - a.requestDate);
  },

  updateDataRequest: (id: string, updates: Partial<DataRequest>): DataRequest | undefined => {
    const existing = dataRequestStore.get(id);
    if (!existing) return undefined;

    const updated: DataRequest = {
      ...existing,
      ...updates,
    };

    if (updates.status === 'completed' && !updated.completedDate) {
      updated.completedDate = Date.now();
    }

    dataRequestStore.set(id, updated);
    return updated;
  },

  getAllDataRequests: (): DataRequest[] => {
    return Array.from(dataRequestStore.values())
      .sort((a, b) => b.requestDate - a.requestDate);
  },

  getPendingDataRequests: (): DataRequest[] => {
    return Array.from(dataRequestStore.values())
      .filter(request => request.status === 'pending')
      .sort((a, b) => b.requestDate - a.requestDate);
  },

  // Data export functionality
  exportUserData: async (email: string): Promise<any> => {
    // Import order store dynamically to avoid circular dependency
    const { OrderStore } = await import('./order-store');
    
    const consent = consentStore.get(email);
    const orders = OrderStore.getByEmail(email);
    const dataRequests = Array.from(dataRequestStore.values())
      .filter(request => request.email === email);

    return {
      personal_data: {
        email,
        consent_record: consent,
        data_requests: dataRequests,
      },
      order_data: orders.map(order => ({
        order_number: order.orderNumber,
        status: order.status,
        customer_name: order.customerName,
        email: order.email,
        phone_number: order.phoneNumber,
        card_config: order.cardConfig,
        shipping: order.shipping,
        pricing: order.pricing,
        created_at: new Date(order.createdAt).toISOString(),
        updated_at: new Date(order.updatedAt).toISOString(),
        estimated_delivery: order.estimatedDelivery,
        tracking_number: order.trackingNumber,
        emails_sent: order.emailsSent,
        notes: order.notes,
      })),
      export_info: {
        exported_at: new Date().toISOString(),
        export_format: 'JSON',
        data_retention_policy: 'Data is retained for 7 years for legal and accounting purposes unless deletion is requested.',
      },
    };
  },

  // Data deletion functionality
  deleteUserData: async (email: string): Promise<boolean> => {
    try {
      // Import order store dynamically to avoid circular dependency
      const { OrderStore } = await import('./order-store');
      
      // Get all orders for this user
      const orders = OrderStore.getByEmail(email);
      
      // Delete all orders (in production, you might want to anonymize instead)
      orders.forEach(order => {
        OrderStore.delete(order.id);
      });

      // Delete consent record
      consentStore.delete(email);

      // Update data requests to mark deletion as completed
      const requests = Array.from(dataRequestStore.values())
        .filter(request => request.email === email && request.type === 'deletion');
      
      requests.forEach(request => {
        if (request.status === 'processing') {
          dataRequestStore.set(request.id, {
            ...request,
            status: 'completed',
            completedDate: Date.now(),
            notes: 'All user data has been permanently deleted',
          });
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to delete user data:', error);
      return false;
    }
  },

  // Development helpers
  clearAll: (): void => {
    consentStore.clear();
    dataRequestStore.clear();
  },

  // Get all consent records (for admin)
  getAllConsents: (): ConsentRecord[] => {
    return Array.from(consentStore.values())
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },
};

// Helper to check if email marketing is allowed
export const canSendMarketingEmail = (email: string): boolean => {
  return GDPRStore.hasValidConsent(email, 'marketing');
};

// Helper to check if analytics tracking is allowed
export const canTrackAnalytics = (email: string): boolean => {
  return GDPRStore.hasValidConsent(email, 'analytics');
};

// Helper to get client IP and user agent for consent recording
export const getClientInfo = (request: Request) => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ipAddress = forwardedFor?.split(',')[0] || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return { ipAddress, userAgent };
};