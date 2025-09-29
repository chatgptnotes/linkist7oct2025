'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ShoppingCart, ChevronDown } from 'lucide-react';

export default function HomePage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Exact Figma Match */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <img src="/logo.svg" alt="Linkist" className="h-8" />
            </Link>
            
            {/* Navigation - Exact Match */}
            <div className="flex items-center space-x-8">
              <Link href="#about" className="text-gray-600 hover:text-gray-900 font-medium">About</Link>
              <Link href="#support" className="text-gray-600 hover:text-gray-900 font-medium">Support</Link>
              <Link href="/cart" className="p-2 text-gray-600 hover:text-gray-900">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <Link href="/nfc/configure" className="btn-primary">Order Now</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Red/Black Gradient Theme */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-red-900 via-red-800 to-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Tap. Connect.<br />Be remembered.
              </h1>
              <p className="text-lg text-red-100 mb-8 leading-relaxed">
                Your smart NFC business card for the digital era. The last business card you'll ever need.
              </p>
              
              {/* Feature Points */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-red-600" />
                  </div>
                  <span className="text-red-100">Customize with your details</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-red-600" />
                  </div>
                  <span className="text-red-100">Includes delivery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-red-600" />
                  </div>
                  <span className="text-red-100">Ships in 7–10 days</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mb-12">
                <Link
                  href="/nfc/configure"
                  className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-red-50 transition-colors inline-block text-center text-lg"
                >
                  Order NFC Card
                </Link>
              </div>
              
              {/* Founder Member Section */}
              <div className="border-t border-red-700 pt-8 mb-8">
                <div className="text-center">
                  <p className="text-red-100 text-lg font-medium">
                    Become a <span className="text-white font-bold">FOUNDER MEMBER</span> and receive one year free when app launches.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - NFC Card Mockup */}
            <div className="relative">
              <div className="relative mx-auto w-80">
                {/* Phone Frame */}
                <div className="bg-black rounded-3xl p-2 shadow-2xl">
                  <div className="bg-gray-900 rounded-2xl p-4 relative overflow-hidden">
                    {/* Phone Screen */}
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 text-white min-h-[600px]">
                      {/* Status Bar */}
                      <div className="flex justify-between items-center text-xs text-gray-300 mb-6">
                        <span>9:41</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-4 h-2 bg-white rounded-sm"></div>
                        </div>
                      </div>
                      
                      {/* App Content */}
                      <div className="text-center mb-6">
                        <img src="/logo.svg" alt="Linkist" className="h-12 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-white mb-2">Recent Contacts</h3>
                      </div>
                      
                      {/* Mock Contact Cards */}
                      <div className="space-y-3">
                        <div className="bg-gray-800 rounded-lg p-3 flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                          <div>
                            <div className="text-sm font-medium text-white">Sarah Kim</div>
                            <div className="text-xs text-gray-400">Product Manager</div>
                          </div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-3 flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                          <div>
                            <div className="text-sm font-medium text-white">Alex Chen</div>
                            <div className="text-xs text-gray-400">Software Engineer</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}\n      <section className=\"py-16 lg:py-24 bg-white\">\n        <div className=\"max-w-4xl mx-auto px-6 text-center\">\n          <h2 className=\"text-3xl font-bold text-gray-900 mb-4\">How It Works</h2>\n          <div className=\"w-20 h-1 bg-red-600 mx-auto mb-12\"></div>\n          \n          <div className=\"grid md:grid-cols-3 gap-8\">\n            <div className=\"text-center\">\n              <div className=\"w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4\">\n                <span className=\"text-2xl\">🛒</span>\n              </div>\n              <h3 className=\"font-semibold text-gray-900 mb-2\">1. Order your card</h3>\n              <p className=\"text-gray-600 text-sm\">Choose your design and customize it with your information</p>\n            </div>\n            \n            <div className=\"text-center\">\n              <div className=\"w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4\">\n                <span className=\"text-2xl\">📝</span>\n              </div>\n              <h3 className=\"font-semibold text-gray-900 mb-2\">2. Customize it with your information</h3>\n              <p className=\"text-gray-600 text-sm\">Add your contact details, social links, and profile</p>\n            </div>\n            \n            <div className=\"text-center\">\n              <div className=\"w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4\">\n                <span className=\"text-2xl\">📩</span>\n              </div>\n              <h3 className=\"font-semibold text-gray-900 mb-2\">3. Receive it and start networking</h3>\n              <p className=\"text-gray-600 text-sm\">Get your card delivered and start connecting instantly</p>\n            </div>\n          </div>\n        </div>\n      </section>\n\n      {/* Pricing Section */}\n      <section className=\"py-16 lg:py-24 bg-red-50\">\n        <div className=\"max-w-4xl mx-auto px-6 text-center\">\n          <h2 className=\"text-3xl font-bold text-gray-900 mb-4\">Pricing</h2>\n          <div className=\"w-20 h-1 bg-red-600 mx-auto mb-12\"></div>\n          \n          <div className=\"bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto\">\n            <div className=\"text-center\">\n              <div className=\"text-5xl font-bold text-red-600 mb-2\">$29.99</div>\n              <p className=\"text-gray-600 mb-6\">Plus shipping</p>\n              <Link\n                href=\"/nfc/configure\"\n                className=\"bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors inline-block w-full\"\n              >\n                Order Now\n              </Link>\n            </div>\n          </div>\n        </div>\n      </section>\n\n      {/* What You Get Section */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center"
                alt="Hand holding NFC card"
                className="rounded-2xl shadow-xl w-full h-80 object-cover"
              />
            </div>

            {/* Right Content */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">What You Get</h2>
              <p className="text-gray-600 mb-8">Everything you need, included in one package.</p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Premium NFC Card</h3>
                    <p className="text-gray-600 text-sm">A durable, high-quality card with your custom design and embedded NFC technology.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Personal Linkist Profile</h3>
                    <p className="text-gray-600 text-sm">A customizable online profile to host all your links, contact info, and social media.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Real-time Analytics</h3>
                    <p className="text-gray-600 text-sm">Track how many taps your card gets and see which links are performing best.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Global Compatibility</h3>
                    <p className="text-gray-600 text-sm">Works with all modern iOS and Android smartphones, no app required.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Exact Figma Match */}
      <section id="about" className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg">
              <button 
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50"
                onClick={() => toggleFAQ(0)}
              >
                <span className="font-medium text-gray-900">Do I need an app to use the card?</span>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openFAQ === 0 ? 'rotate-180' : ''}`} />
              </button>
              {openFAQ === 0 && (
                <div className="px-6 pb-4 text-gray-600">
                  No! The NFC card works with any smartphone that has NFC capability. Simply tap your card to any phone and your digital profile will open automatically - no app required.
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg">
              <button 
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50"
                onClick={() => toggleFAQ(1)}
              >
                <span className="font-medium text-gray-900">What phones are compatible?</span>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openFAQ === 1 ? 'rotate-180' : ''}`} />
              </button>
              {openFAQ === 1 && (
                <div className="px-6 pb-4 text-gray-600">
                  Most modern smartphones support NFC, including iPhone 7 and newer, and most Android phones from the last 5 years. The recipient&apos;s phone needs NFC to receive your information.
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg">
              <button 
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50"
                onClick={() => toggleFAQ(2)}
              >
                <span className="font-medium text-gray-900">How long does shipping take?</span>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openFAQ === 2 ? 'rotate-180' : ''}`} />
              </button>
              {openFAQ === 2 && (
                <div className="px-6 pb-4 text-gray-600">
                  Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available for an additional fee. International orders may take 10-14 business days.
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg">
              <button 
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50"
                onClick={() => toggleFAQ(3)}
              >
                <span className="font-medium text-gray-900">Can I update my information after ordering?</span>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${openFAQ === 3 ? 'rotate-180' : ''}`} />
              </button>
              {openFAQ === 3 && (
                <div className="px-6 pb-4 text-gray-600">
                  Yes! Your digital profile is completely updateable. You can change your contact information, social links, and profile photo anytime through your Linkist dashboard.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">Need Help?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Get Support</h3>
              <p className="text-gray-600 mb-6">Have questions about your NFC card or need technical assistance?</p>
              <Link href="mailto:support@linkist.com" className="btn-primary inline-block px-6 py-3">
                Contact Support
              </Link>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Documentation</h3>
              <p className="text-gray-600 mb-6">Learn how to make the most of your Linkist NFC card with our guides.</p>
              <Link href="#" className="text-red-500 hover:text-red-600 font-medium">
                View Documentation →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Exact Figma Match */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <img src="/logo.svg" alt="Linkist" className="h-8 filter brightness-0 invert" />
              </div>
              <p className="text-gray-300 text-sm">
                Network<br />
                Differently.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="#how-it-works" className="hover:text-white">Features</Link></li>
                <li><Link href="/nfc/configure" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#support" className="hover:text-white">For Teams</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="#about" className="hover:text-white">About Us</Link></li>
                <li><Link href="#support" className="hover:text-white">Support</Link></li>
                <li><Link href="mailto:hello@linkist.com" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}