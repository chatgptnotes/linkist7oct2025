import React from 'react';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import Footer from '@/components/Footer';

// Icon aliases
const ArrowLeft = ArrowBackIcon;
const Shield = SecurityIcon;
const Mail = EmailIcon;
const Eye = VisibilityIcon;
const Trash2 = DeleteIcon;
const Download = CloudDownloadIcon;

export default function PrivacyPolicyPage() {
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
            <Shield className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              At Linkist ("we," "our," or "us"), we respect your privacy and are committed to protecting 
              your personal data. This privacy policy explains how we collect, use, and safeguard your 
              information when you use our NFC card service and website.
            </p>
          </section>

          {/* Data We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>NFC card configuration details (name, title, contact info for cards)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Technical Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>IP address and browser information</li>
                  <li>Device information and operating system</li>
                  <li>Website usage data and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Order Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Purchase history and order details</li>
                  <li>Shipping and delivery information</li>
                  <li>Customer service interactions</li>
                  <li>Product preferences and feedback</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Data */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Mail className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Service Delivery</h3>
                  <p className="text-sm text-gray-700">
                    Process orders, create NFC cards, handle shipping, and provide customer support.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Eye className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Analytics</h3>
                  <p className="text-sm text-gray-700">
                    Understand website usage, improve our services, and optimize user experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Communication</h3>
                  <p className="text-sm text-gray-700">
                    Send order confirmations, shipping updates, and important service notifications.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Security</h3>
                  <p className="text-sm text-gray-700">
                    Protect against fraud, ensure account security, and maintain service integrity.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Basis */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Legal Basis for Processing</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Contract performance:</strong> Processing necessary to fulfill our service agreement with you.</p>
              <p><strong>Legitimate interests:</strong> Improving our services, security, and business operations.</p>
              <p><strong>Consent:</strong> Marketing communications and optional features (with your explicit permission).</p>
              <p><strong>Legal obligations:</strong> Tax, accounting, and regulatory compliance requirements.</p>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Sharing and Third Parties</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                We do not sell your personal data. We only share information with trusted partners who help us provide our services:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p><strong>Payment Processing:</strong> Stripe (for secure payment processing)</p>
                <p><strong>Email Services:</strong> Resend (for transactional emails)</p>
                <p><strong>Shipping:</strong> Authorized carriers for order delivery</p>
                <p><strong>Analytics:</strong> Anonymous usage statistics (if consented)</p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <div className="space-y-3 text-gray-700">
              <p>We implement industry-standard security measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure payment processing (PCI DSS compliant)</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal data on a need-to-know basis</li>
                <li>Secure data centers and infrastructure</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Privacy Rights</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Download className="w-5 h-5 text-red-600" />
                  <h3 className="font-medium text-red-900">Access & Portability</h3>
                </div>
                <p className="text-sm text-red-800">
                  Request a copy of all personal data we hold about you in a machine-readable format.
                </p>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <h3 className="font-medium text-red-900">Deletion</h3>
                </div>
                <p className="text-sm text-red-800">
                  Request deletion of your personal data (subject to legal retention requirements).
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-green-900">Rectification</h3>
                </div>
                <p className="text-sm text-green-800">
                  Correct inaccurate or incomplete personal information.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-purple-900">Objection</h3>
                </div>
                <p className="text-sm text-purple-800">
                  Object to processing of your data for marketing or legitimate interests.
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>To exercise these rights:</strong> Contact us at{' '}
                <a href="mailto:privacy@linkist.ai" className="text-red-500 hover:text-red-600">
                  privacy@linkist.ai
                </a>{' '}
                or use our{' '}
                <Link href="/privacy/manage" className="text-red-500 hover:text-red-600">
                  privacy management portal
                </Link>.
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
            <div className="space-y-3 text-gray-700">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Essential cookies:</strong> Enable core website functionality</li>
                <li><strong>Analytics cookies:</strong> Understand website usage (with your consent)</li>
                <li><strong>Marketing cookies:</strong> Deliver relevant content (with your consent)</li>
              </ul>
              <p>
                You can manage your cookie preferences through our consent banner or browser settings.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
            <div className="space-y-3 text-gray-700">
              <p>We retain your personal data only as long as necessary:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Account data:</strong> Until account deletion or 7 years after last activity</li>
                <li><strong>Order history:</strong> 7 years for tax and legal compliance</li>
                <li><strong>Marketing consent:</strong> Until withdrawn or 2 years of inactivity</li>
                <li><strong>Technical logs:</strong> 90 days for security and troubleshooting</li>
              </ul>
            </div>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Data Transfers</h2>
            <p className="text-gray-700">
              Our servers are located in secure data centers. When we transfer data internationally, 
              we ensure appropriate safeguards are in place, including standard contractual clauses 
              and adequacy decisions recognized by data protection authorities.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700">
              Our services are not intended for children under 16. We do not knowingly collect 
              personal information from children. If you believe we have collected information 
              from a child, please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Policy Updates</h2>
            <p className="text-gray-700">
              We may update this privacy policy periodically. We will notify you of significant 
              changes by email or through our website. Your continued use of our services after 
              changes take effect constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="font-medium text-red-900 mb-3">Privacy Questions or Concerns?</h3>
              <div className="space-y-2 text-red-800">
                <p><strong>Email:</strong> privacy@linkist.ai</p>
                <p><strong>Data Protection Officer:</strong> dpo@linkist.ai</p>
                <p><strong>Privacy Portal:</strong> <Link href="/privacy/manage" className="underline">linkist.ai/privacy/manage</Link></p>
              </div>
              <p className="text-sm text-red-700 mt-4">
                We will respond to all privacy requests within 30 days.
              </p>
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/privacy/manage"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
          >
            <Shield className="w-5 h-5 mr-2" />
            Manage Privacy Settings
          </Link>
          
          <Link
            href="/terms"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
          >
            View Terms of Service
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}