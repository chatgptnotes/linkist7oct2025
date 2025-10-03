'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CartCardPreview from '@/components/CartCardPreview';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Icon aliases
const ArrowLeft = ArrowBackIcon;
const ShoppingCart = ShoppingCartIcon;
const Minus = RemoveIcon;
const Plus = AddIcon;
const Trash2 = DeleteIcon;
const CheckCircle = CheckCircleIcon;

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    config: {
      firstName: string;
      lastName: string;
      title?: string;
      company?: string;
      mobile?: string;
      email?: string;
      website?: string;
      linkedin?: string;
      instagram?: string;
      twitter?: string;
      profileImage?: string;
      backgroundImage?: string;
      whatsapp?: boolean;
      logo?: string;
      quantity?: number;
    };
    image?: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart data from localStorage
    const savedConfig = localStorage.getItem('cardConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      
      // Check if proof is approved
      if (config.status !== 'approved') {
        // Redirect to proof approval if not approved
        router.push('/nfc/proof-approval');
        return;
      }
      
      setCartItems([{
        id: 1,
        name: 'Linkist NFC Card',
        price: 29.99,
        quantity: config.quantity || 1,
        config: config,
        image: '/card-mockup.png' // We'll add this image
      }]);
    }
    setLoading(false);
  }, [router]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    return 5.00; // Fixed shipping cost
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.05; // 5% VAT
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Start by configuring your NFC card</p>
          <Link href="/nfc/configure" className="btn-primary inline-block px-8 py-3">
            Configure Your Card
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back to Shop */}
        <button
          onClick={() => router.push('/nfc/configure')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Shop
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            
            <div className="bg-white rounded-lg p-6 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-6">
                  {/* Card Image */}
                  <CartCardPreview config={item.config} size="medium" />

                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <div className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </div>
                    </div>
                    <div className="text-sm text-red-600 font-medium mb-1">FOUNDER MEMBER</div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Name: {item.config.firstName} {item.config.lastName}</div>
                      <div>Title: {item.config.title || 'Your Title'}</div>
                      <div>Company: {item.config.company || 'Your Company'}</div>
                      {item.config.email && <div>Email: {item.config.email}</div>}
                      {item.config.mobile && <div>Mobile: {item.config.mobile}</div>}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">${item.price}</div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}

              <div className="mt-6 pt-6 border-t">
                <Link href="/nfc/configure" className="text-red-500 hover:text-red-600 font-medium">
                  + Add another card
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${calculateShipping().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5%)</span>
                <span className="font-medium">${calculateTax().toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-500">All prices in USD</div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-red-500 text-white py-3 rounded font-medium hover:bg-red-600 transition-colors mt-6"
            >
              Proceed to Checkout
            </button>

            <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span>Secure payments by Stripe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img src="/logo.svg" alt="Linkist" className="h-8 filter brightness-0 invert mb-4" />
              <p className="text-gray-300 text-sm">
                Network<br />
                Differently.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">For Teams</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}