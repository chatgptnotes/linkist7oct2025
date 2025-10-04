import React from 'react';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import ScaleIcon from '@mui/icons-material/Scale';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarningIcon from '@mui/icons-material/Warning';
import Footer from '@/components/Footer';

// Icon aliases
const ArrowLeft = ArrowBackIcon;
const FileText = DescriptionIcon;
const Scale = ScaleIcon;
const CreditCard = CreditCardIcon;
const Truck = LocalShippingIcon;
const AlertTriangle = WarningIcon;

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-red-500 hover:text-red-600 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="flex items-center space-x-3 mb-4">
            <FileText className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          </div>
          
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Welcome to Linkist ("we," "our," or "us"). These Terms of Service ("Terms") govern your 
                use of our website, products, and services (collectively, the "Service").
              </p>
              <p>
                By accessing or using our Service, you agree to be bound by these Terms. If you disagree 
                with any part of these terms, you may not access the Service.
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Service</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Linkist provides NFC (Near Field Communication) business cards and related services, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Custom NFC business card design and manufacturing</li>
                <li>Digital profile management and hosting</li>
                <li>Order processing and shipping services</li>
                <li>Customer support and technical assistance</li>
              </ul>
            </div>
          </section>

          {/* Account Terms */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Account Terms</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Creation</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>You must be at least 18 years old to use our Service</li>
                  <li>One person or entity may maintain only one account</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Responsibilities</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Keep your login credentials secure and confidential</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>You are liable for all activities under your account</li>
                  <li>Update your information to keep it accurate and current</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Orders and Payment */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Orders and Payment</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Order Processing</h3>
                <p>
                  When you place an order, you make an offer to purchase products at the stated price. 
                  We reserve the right to accept or decline any order for any reason.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Pricing and Payment</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>All prices are in USD and include applicable taxes</li>
                  <li>Payment is due at the time of order placement</li>
                  <li>We accept major credit cards and digital payment methods</li>
                  <li>Prices may change without notice, but confirmed orders are honored</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Order Modifications</h3>
                <p>
                  Orders may be modified or canceled within 24 hours of placement. 
                  Once production begins, changes may not be possible.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping and Delivery */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Shipping and Delivery</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Policy</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Processing time: 3-5 business days</li>
                  <li>Shipping time: 5-7 business days (standard)</li>
                  <li>Express shipping options available</li>
                  <li>International shipping may take 10-21 business days</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Address</h3>
                <p>
                  You are responsible for providing accurate shipping information. 
                  We are not liable for delays or non-delivery due to incorrect addresses.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Risk of Loss</h3>
                <p>
                  Risk of loss and title passes to you upon delivery to the shipping carrier.
                </p>
              </div>
            </div>
          </section>

          {/* Product Quality and Returns */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Product Quality and Returns</h2>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Quality Guarantee</h3>
                <p>
                  We guarantee our products to be free from defects in materials and workmanship. 
                  If you receive a defective product, contact us within 30 days for a replacement.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Custom Products</h3>
                <p>
                  As our products are custom-made to your specifications, returns are only accepted 
                  for defective items or errors in production.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Return Process</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Contact customer service within 30 days</li>
                  <li>Provide order number and description of issue</li>
                  <li>Return shipping may be provided for defective items</li>
                  <li>Refunds processed within 5-10 business days</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property Rights</h2>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your Content</h3>
                <p>
                  You retain ownership of any intellectual property you provide (logos, text, images). 
                  By submitting content, you grant us a license to use it for order fulfillment and service provision.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Our Content</h3>
                <p>
                  The Service and its content, features, and functionality are owned by Linkist and are 
                  protected by copyright, trademark, and other intellectual property laws.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Restrictions</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Do not use our Service for illegal or unauthorized purposes</li>
                  <li>Do not reproduce, modify, or distribute our content</li>
                  <li>Do not reverse engineer our technology or products</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Prohibited Uses */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Prohibited Uses</h2>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800 mb-3 font-medium">You may not use our Service:</p>
              <ul className="list-disc list-inside space-y-1 text-red-700 ml-4">
                <li>For any unlawful purpose or to solicit unlawful acts</li>
                <li>To violate any international, federal, provincial, or state laws</li>
                <li>To infringe upon or violate intellectual property rights</li>
                <li>To harass, abuse, insult, harm, defame, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload viruses or malicious code</li>
                <li>To collect or track personal information of others</li>
                <li>To spam, phish, or engage in similar activities</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimers</h2>
            
            <div className="space-y-4 text-gray-700">
              <p>
                Our Service is provided on an "as is" and "as available" basis. We make no warranties, 
                expressed or implied, and hereby disclaim all other warranties including implied warranties 
                of merchantability, fitness for a particular purpose, or non-infringement.
              </p>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Technology Limitations</h3>
                <p>
                  NFC technology requires compatible devices and may not work with all smartphones or systems. 
                  We cannot guarantee universal compatibility.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Third-Party Services</h3>
                <p>
                  Our Service may integrate with third-party services. We are not responsible for the 
                  availability, accuracy, or reliability of such services.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-800">
                In no event shall Linkist, its directors, employees, partners, agents, suppliers, or affiliates 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including 
                loss of profits, data, use, or goodwill, arising out of your access to or use of the Service.
              </p>
              
              <p className="text-gray-800 mt-4">
                Our total liability to you for all claims arising from the use of our Service shall not exceed 
                the amount you paid for the products in question.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Indemnification</h2>
            
            <p className="text-gray-700">
              You agree to defend, indemnify, and hold harmless Linkist from any loss, damage, liability, 
              claim, or demand arising out of your use of the Service, violation of these Terms, or 
              infringement of any intellectual property rights.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
            
            <div className="space-y-3 text-gray-700">
              <p>
                We may terminate or suspend your account immediately, without prior notice, for any reason, 
                including breach of these Terms.
              </p>
              <p>
                Upon termination, your right to use the Service will cease immediately. Provisions that by 
                their nature should survive termination shall survive, including ownership provisions, 
                warranty disclaimers, and limitation of liability.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
            
            <p className="text-gray-700">
              These Terms are governed by and construed in accordance with the laws of [Your State/Country], 
              without regard to its conflict of law provisions. Our failure to enforce any right or provision 
              will not be deemed a waiver of such right or provision.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
            
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. We will notify users of significant 
              changes via email or website notice. Your continued use of the Service after changes take effect 
              constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="font-medium text-red-900 mb-3">Questions About These Terms?</h3>
              <div className="space-y-2 text-red-800">
                <p><strong>Email:</strong> legal@linkist.ai</p>
                <p><strong>Customer Support:</strong> support@linkist.ai</p>
                <p><strong>Mailing Address:</strong></p>
                <p className="ml-4">
                  Linkist<br />
                  [Your Address]<br />
                  [City, State ZIP Code]
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/privacy"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
          >
            View Privacy Policy
          </Link>
          
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
          >
            Contact Support
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}