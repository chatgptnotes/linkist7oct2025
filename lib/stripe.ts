import Stripe from 'stripe';

// Allow missing Stripe key during build time
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey && process.env.NODE_ENV !== 'production') {
  console.warn('⚠️ STRIPE_SECRET_KEY not found. Stripe functionality will be disabled.');
}

export const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};

// Product configuration
export const PRODUCT_CONFIG = {
  NFC_CARD: {
    id: 'nfc-card',
    name: 'Linkist NFC Card',
    price: 29.99,
    currency: 'usd',
  },
  SHIPPING: {
    id: 'shipping',
    name: 'Standard Shipping',
    price: 5.00,
    currency: 'usd',
  },
  TAX_RATE: 0.05, // 5% VAT
};

export default stripe;