// Newsletter-related TypeScript definitions

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string;
  subscribed_at: string;
  unsubscribed_at?: string | null;
  consent_given: boolean;
  ip_address?: string | null;
  user_agent?: string | null;
  tags: string[];
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriptionRequest {
  email: string;
  source?: string;
  consent_given: boolean;
  ip_address?: string | null;
  user_agent?: string | null;
  tags?: string[];
  preferences?: Record<string, any>;
}

export interface NewsletterFormState {
  email: string;
  consent: boolean;
  isSubmitting: boolean;
  message: {
    type: 'success' | 'error' | null;
    text: string;
  };
  errors: {
    email?: string;
    consent?: string;
  };
}

export interface NewsletterValidationError {
  field: 'email' | 'consent';
  message: string;
}

export interface NewsletterApiResponse {
  success: boolean;
  message: string;
  data?: NewsletterSubscriber;
  error?: string;
}