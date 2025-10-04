import React from 'react';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HttpsIcon from '@mui/icons-material/Https';
import Footer from '@/components/Footer';

// Icon aliases
const ArrowLeft = ArrowBackIcon;
const Shield = SecurityIcon;
const Lock = LockIcon;
const VerifiedUser = VerifiedUserIcon;
const Https = HttpsIcon;

export default function SecurityPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">Security</h1>
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment to Security</h2>
            <p className="text-gray-700 leading-relaxed">
              At Linkist, we take security seriously. We implement industry-standard security measures
              to protect your data and ensure safe transactions. Your trust is our priority, and we're
              committed to maintaining the highest security standards.
            </p>
          </section>

          {/* Data Encryption */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Encryption</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Https className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">SSL/TLS Encryption</h3>
                  <p className="text-gray-700 text-sm">
                    All data transmitted between your browser and our servers is encrypted using
                    256-bit SSL/TLS encryption.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Lock className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Data at Rest</h3>
                  <p className="text-gray-700 text-sm">
                    Your personal information and payment data are encrypted when stored in our
                    secure databases.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Security</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <VerifiedUser className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">Stripe Integration</h3>
                  <p className="text-blue-700 text-sm mb-3">
                    We use Stripe for payment processing, a PCI DSS Level 1 certified service provider.
                    Your payment information is never stored on our servers.
                  </p>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• 3D Secure authentication for card payments</li>
                    <li>• Tokenization of sensitive payment data</li>
                    <li>• Real-time fraud detection and prevention</li>
                    <li>• Compliance with international payment standards</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Account Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Security</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Password Requirements</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Minimum 8 characters in length</li>
                  <li>Combination of uppercase and lowercase letters</li>
                  <li>At least one number and special character</li>
                  <li>Passwords are hashed using industry-standard algorithms</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                <p className="text-gray-700">
                  We offer optional two-factor authentication (2FA) via SMS or authenticator apps
                  to add an extra layer of security to your account.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Session Management</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Automatic logout after 30 minutes of inactivity</li>
                  <li>Secure session tokens that expire regularly</li>
                  <li>Device tracking and login notifications</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Security Measures */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Security Measures</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Infrastructure Security</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Firewalls and intrusion detection systems</li>
                  <li>• Regular security audits and penetration testing</li>
                  <li>• DDoS protection and traffic monitoring</li>
                  <li>• Secure cloud infrastructure (AWS/GCP)</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Data Protection</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Regular automated backups</li>
                  <li>• Data retention policies</li>
                  <li>• Secure data deletion protocols</li>
                  <li>• Access control and monitoring</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Compliance</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• GDPR compliant</li>
                  <li>• PCI DSS standards</li>
                  <li>• ISO 27001 aligned practices</li>
                  <li>• SOC 2 Type II certified partners</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Team Security</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Security training for all employees</li>
                  <li>• Background checks on staff</li>
                  <li>• Principle of least privilege access</li>
                  <li>• Regular security awareness programs</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Incident Response */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Incident Response</h2>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="font-medium text-amber-900 mb-2">Security Incident Protocol</h3>
              <p className="text-amber-700 text-sm mb-3">
                In the unlikely event of a security incident, we have a comprehensive response plan:
              </p>
              <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
                <li>Immediate containment and investigation</li>
                <li>Notification to affected users within 72 hours</li>
                <li>Coordination with relevant authorities</li>
                <li>Post-incident analysis and security improvements</li>
              </ol>
            </div>
          </section>

          {/* Reporting */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Report a Security Issue</h2>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you discover a security vulnerability or have security concerns, please report them
                immediately to our security team:
              </p>
              <div className="space-y-2">
                <p className="text-gray-900">
                  <span className="font-medium">Email:</span>{' '}
                  <a href="mailto:security@linkist.ai" className="text-red-500 hover:text-red-600">
                    security@linkist.ai
                  </a>
                </p>
                <p className="text-gray-700 text-sm">
                  We take all security reports seriously and will respond within 24 hours.
                </p>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Security Best Practices for Users</h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-medium text-green-900 mb-3">Protect Your Account</h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>✓ Use a strong, unique password for your Linkist account</li>
                <li>✓ Enable two-factor authentication (2FA)</li>
                <li>✓ Never share your login credentials with anyone</li>
                <li>✓ Log out from shared or public devices</li>
                <li>✓ Keep your email account secure</li>
                <li>✓ Be cautious of phishing emails claiming to be from Linkist</li>
                <li>✓ Regularly review your account activity</li>
                <li>✓ Update your password periodically</li>
              </ul>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
