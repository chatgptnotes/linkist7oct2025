'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import { cartUtils, safeLocalStorage } from '@/lib/cart-utils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Icon aliases
const ArrowLeft = ArrowBackIcon;
const CheckCircle = CheckCircleIcon;
const XCircle = CancelIcon;
const Edit = EditIcon;
const ShoppingCart = ShoppingCartIcon;

interface CardConfig {
  fullName: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  mobile: string;
  whatsapp?: string;
  email: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  profileImage?: string | null;
  backgroundImage?: string | null;
  quantity: number;
  timestamp: string;
  status: string;
}

export default function ProofApprovalPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [cardConfig, setCardConfig] = useState<CardConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [approved, setApproved] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approving, setApproving] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('cardConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setCardConfig(config);
      generateQRCode(config);
    } else {
      // No config found, redirect to configurator
      router.push('/nfc/configure');
      return;
    }
    setLoading(false);
  }, [router]);

  const generateQRCode = async (config: CardConfig) => {
    try {
      console.log('🔍 Generating QR code for config:', config);
      const response = await fetch('/api/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardData: config }),
      });

      console.log('📡 QR API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ QR code generated successfully:', data);
        setQrCodeDataUrl(data.qrCodeDataUrl);
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to generate QR code:', errorData);
        
        // Fallback: Generate a simple QR code with contact info
        const contactInfo = `BEGIN:VCARD\nVERSION:3.0\nFN:${config.fullName}\nORG:${config.company}\nTEL:${config.mobile}\nEMAIL:${config.email}\nURL:${config.website || ''}\nEND:VCARD`;
        const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(contactInfo)}`;
        console.log('🔄 Using fallback QR code:', fallbackQrUrl);
        setQrCodeDataUrl(fallbackQrUrl);
      }
    } catch (error) {
      console.error('💥 Error generating QR code:', error);
      
      // Fallback: Generate a simple QR code with contact info
      const contactInfo = `BEGIN:VCARD\nVERSION:3.0\nFN:${config.fullName}\nORG:${config.company}\nTEL:${config.mobile}\nEMAIL:${config.email}\nURL:${config.website || ''}\nEND:VCARD`;
      const fallbackQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(contactInfo)}`;
      console.log('🔄 Using fallback QR code due to error:', fallbackQrUrl);
      setQrCodeDataUrl(fallbackQrUrl);
    }
  };


  const handleApprove = async () => {
    if (!cardConfig) return;
    
    setApproving(true);
    
    try {
      // Simulate approval process that takes time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update status to approved
      const approvedConfig = {
        ...cardConfig,
        status: 'approved',
        approvedAt: new Date().toISOString()
      };
      
      localStorage.setItem('cardConfig', JSON.stringify(approvedConfig));
      
      setApproved(true);
      setShowApprovalModal(true);
      showToast('Card configuration approved! Ready for checkout.', 'success');
    } catch (error) {
      console.error('Error during approval:', error);
      showToast('Failed to approve configuration. Please try again.', 'error');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = () => {
    showToast('Redirecting to configuration page for changes...', 'info');
    // Redirect back to configurator for changes
    router.push('/nfc/configure');
  };

  const handleProceedToCart = async () => {
    if (!cardConfig) return;
    
    setAddingToCart(true);
    showToast('Adding to cart and redirecting...', 'info');
    
    try {
      // Simulate adding to cart process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to cart using safe utilities
      const newItem = {
        id: Date.now(),
        name: 'Linkist NFC Card',
        price: 29.99,
        quantity: cardConfig.quantity || 1,
        config: cardConfig
      };
      
      const result = cartUtils.addToCart(newItem);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save to cart');
      }
      
      showToast('Successfully added to cart!', 'success');
      
      // Navigate to cart
      router.push('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Failed to add to cart. Please try again.', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading your proof...</p>
        </div>
      </div>
    );
  }

  if (!cardConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">No configuration found</p>
          <Link href="/nfc/configure" className="btn-primary">Start Configuring</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/nfc/configure')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Configuration
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Proof Approval Required</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Review your card design carefully. Once approved, this will be exactly how your card is printed. 
            All details must be correct before proceeding to purchase.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Card Details Review */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Card Details</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <p className="text-gray-900 mt-1">{cardConfig.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <p className="text-gray-900 mt-1">{cardConfig.lastName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Job Title</label>
                  <p className="text-gray-900 mt-1">{cardConfig.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Company</label>
                  <p className="text-gray-900 mt-1">{cardConfig.company}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                <p className="text-gray-900 mt-1">{cardConfig.mobile}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900 mt-1">{cardConfig.email}</p>
              </div>

              {cardConfig.website && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Website</label>
                  <p className="text-gray-900 mt-1">{cardConfig.website}</p>
                </div>
              )}

              {/* Social Media */}
              {(cardConfig.linkedin || cardConfig.instagram || cardConfig.twitter) && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Social Media</label>
                  <div className="mt-1 space-y-1">
                    {cardConfig.linkedin && <p className="text-gray-900 text-sm">LinkedIn: {cardConfig.linkedin}</p>}
                    {cardConfig.instagram && <p className="text-gray-900 text-sm">Instagram: {cardConfig.instagram}</p>}
                    {cardConfig.twitter && <p className="text-gray-900 text-sm">Twitter: {cardConfig.twitter}</p>}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700">Quantity</label>
                <p className="text-gray-900 mt-1">{cardConfig.quantity} card(s)</p>
              </div>

              {/* Images */}
              {(cardConfig.profileImage || cardConfig.backgroundImage) && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Custom Images</label>
                  <div className="mt-2 flex space-x-4">
                    {cardConfig.profileImage && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Profile Photo</p>
                        <img
                          src={cardConfig.profileImage}
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover border"
                        />
                      </div>
                    )}
                    {cardConfig.backgroundImage && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Background Image</p>
                        <img
                          src={cardConfig.backgroundImage}
                          alt="Background"
                          className="w-20 h-12 rounded object-cover border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Edit Button */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => router.push('/nfc/configure')}
                className="flex items-center text-red-600 hover:text-red-700 font-medium"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Configuration
              </button>
            </div>
          </div>

          {/* Card Preview */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Card Preview</h2>
            
            {/* Front Card */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Front Side</h3>
              <div className="max-w-sm mx-auto">
                <div 
                  className="w-full aspect-[1.586/1] bg-black rounded-lg p-6 text-white relative overflow-hidden"
                  style={cardConfig.backgroundImage ? {
                    backgroundImage: `url(${cardConfig.backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } : {}}
                >
                  {/* Logo */}
                  <div className="flex items-center space-x-2 mb-4">
                    <img src="/logo.svg" alt="Linkist" className="h-6 filter brightness-0 invert" />
                    <div className="ml-auto">
                      <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        FOUNDER
                      </div>
                    </div>
                  </div>

                  {/* Profile Image - Moved to avoid overlap with edit button */}
                  <div className="absolute top-20 right-6 w-16 h-16 bg-black rounded-full overflow-hidden border-2 border-white/20">
                    <img 
                      src={cardConfig.profileImage || "https://images.unsplash.com/photo-1494790108755-2616b612b5b0?w=150&h=150&fit=crop&crop=face"} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name and Title */}
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">
                      {cardConfig.fullName}
                    </h3>
                    <p className="text-gray-300 text-sm drop-shadow-md">
                      {cardConfig.title}, {cardConfig.company}
                    </p>
                    <p className="text-gray-300 text-xs mt-1 drop-shadow-md">
                      {cardConfig.email}
                    </p>
                  </div>

                  {/* QR Code */}
                  <div className="absolute bottom-6 right-6 w-12 h-12 bg-white border border-gray-300 rounded flex items-center justify-center">
                    {qrCodeDataUrl ? (
                      <img 
                        src={qrCodeDataUrl} 
                        alt="QR Code" 
                        className="w-full h-full object-contain rounded"
                        onLoad={() => console.log('🖼️ Front QR code image loaded successfully')}
                        onError={(e) => console.error('❌ Front QR code image failed to load:', e)}
                      />
                    ) : (
                      <div className="text-xs text-gray-400 text-center">
                        QR
                        <div className="text-xs text-red-400">Loading...</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Back Card */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Back Side</h3>
              <div className="max-w-sm mx-auto">
                <div className="w-full aspect-[1.586/1] bg-black border border-gray-600 rounded-lg p-4 relative overflow-hidden">
                  {/* Contact Information - Condensed */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <span className="text-white text-xs">{cardConfig.mobile}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <span className="text-white text-xs">{cardConfig.email}</span>
                    </div>
                    
                    {cardConfig.website && (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white text-xs">{cardConfig.website}</span>
                      </div>
                    )}

                    {/* Social Icons - Smaller */}
                    <div className="pt-2 border-t border-gray-600">
                      <div className="flex justify-center space-x-2">
                        {cardConfig.linkedin && (
                          <div className="w-6 h-6 bg-red-700 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">in</span>
                          </div>
                        )}
                        {cardConfig.instagram && (
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                        )}
                        {cardConfig.twitter && (
                          <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="absolute bottom-2 right-2 w-12 h-12 bg-white border border-gray-300 rounded flex items-center justify-center">
                    {qrCodeDataUrl ? (
                      <img 
                        src={qrCodeDataUrl} 
                        alt="QR Code" 
                        className="w-full h-full object-contain rounded"
                        onLoad={() => console.log('🖼️ QR code image loaded successfully')}
                        onError={(e) => console.error('❌ QR code image failed to load:', e)}
                      />
                    ) : (
                      <div className="text-xs text-gray-400 text-center">
                        QR
                        <div className="text-xs text-red-400">Loading...</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Actions */}
        {!approved ? (
          <div className="bg-white rounded-lg p-6 mt-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Required</h3>
              <p className="text-gray-600 mb-6">
                Please review all details carefully. Once approved, your card will be queued for production exactly as shown above.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleReject}
                  className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Need Changes
                </button>
                <button
                  onClick={handleApprove}
                  disabled={approving}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    approving
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {approving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Approval...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Approve & Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">Proof Approved!</h3>
              <p className="text-green-700 mb-6">
                Your design has been approved for printing. You can now proceed to add it to your cart.
              </p>
              <button
                onClick={handleProceedToCart}
                disabled={addingToCart}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  addingToCart
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {addingToCart ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adding to Cart...
                  </div>
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Proof Approved!</h3>
              <p className="text-gray-600 mb-6">
                Your card design has been approved and added to your cart. Ready for checkout!
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Continue Reviewing
                </button>
                <button
                  onClick={handleProceedToCart}
                  disabled={addingToCart}
                  className={`flex-1 px-4 py-2 rounded transition-colors ${
                    addingToCart
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {addingToCart ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Redirecting...
                    </div>
                  ) : (
                    'Go to Cart'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}