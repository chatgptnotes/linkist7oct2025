import React from 'react';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import ContrastIcon from '@mui/icons-material/Contrast';
import Footer from '@/components/Footer';

// Icon aliases
const ArrowLeft = ArrowBackIcon;
const Accessibility = AccessibilityNewIcon;
const Eye = VisibilityIcon;
const Keyboard = KeyboardIcon;
const VolumeUp = VolumeUpIcon;
const Contrast = ContrastIcon;

export default function AccessibilityPage() {
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
            <Accessibility className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">Accessibility Statement</h1>
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Linkist, we're committed to ensuring digital accessibility for people with disabilities.
              We continually improve the user experience for everyone and apply relevant accessibility
              standards to ensure our website is accessible to all users.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards
              to make our website perceivable, operable, understandable, and robust for all users.
            </p>
          </section>

          {/* Accessibility Features */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessibility Features</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Keyboard className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Keyboard Navigation</h3>
                  <p className="text-gray-700 text-sm">
                    Full keyboard accessibility with logical tab order and visible focus indicators
                    for all interactive elements.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <VolumeUp className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Screen Reader Support</h3>
                  <p className="text-gray-700 text-sm">
                    Compatible with popular screen readers including JAWS, NVDA, and VoiceOver
                    with proper ARIA labels and semantic HTML.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Contrast className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Color Contrast</h3>
                  <p className="text-gray-700 text-sm">
                    WCAG AA compliant color contrast ratios (minimum 4.5:1 for normal text,
                    3:1 for large text) throughout the site.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Eye className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Visual Design</h3>
                  <p className="text-gray-700 text-sm">
                    Clear visual hierarchy, readable fonts, and adequate spacing to improve
                    readability for users with visual impairments.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Standards Compliance */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Standards & Guidelines</h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-medium text-red-900 mb-3">WCAG 2.1 Level AA Compliance</h3>
              <p className="text-red-700 text-sm mb-4">
                We strive to meet the following Web Content Accessibility Guidelines principles:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-red-900 text-sm mb-2">Perceivable</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Alternative text for images</li>
                    <li>• Captions and transcripts for media</li>
                    <li>• Content adaptable to different presentations</li>
                    <li>• Distinguishable visual and audio content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-900 text-sm mb-2">Operable</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Full keyboard accessibility</li>
                    <li>• Sufficient time to read and use content</li>
                    <li>• No content causing seizures</li>
                    <li>• Easy navigation and find content</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-900 text-sm mb-2">Understandable</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Readable and understandable text</li>
                    <li>• Predictable web page behavior</li>
                    <li>• Input assistance and error prevention</li>
                    <li>• Clear instructions and labels</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-900 text-sm mb-2">Robust</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Compatible with assistive technologies</li>
                    <li>• Valid HTML and ARIA markup</li>
                    <li>• Cross-browser compatibility</li>
                    <li>• Future-proof code standards</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Implementation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technical Implementation</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Semantic HTML</h3>
                <p className="text-gray-700 text-sm">
                  We use proper HTML5 semantic elements (header, nav, main, article, section, footer)
                  to provide meaningful structure for assistive technologies.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">ARIA Attributes</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>ARIA labels for interactive elements</li>
                  <li>ARIA live regions for dynamic content updates</li>
                  <li>Proper role attributes for custom components</li>
                  <li>ARIA states and properties for UI widgets</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Form Accessibility</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Clear and descriptive form labels</li>
                  <li>Visible focus indicators</li>
                  <li>Error messages with suggestions</li>
                  <li>Required field indicators</li>
                  <li>Logical tab order</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Responsive Design</h3>
                <p className="text-gray-700 text-sm">
                  Our website is fully responsive and works seamlessly across different devices,
                  screen sizes, and orientations, ensuring accessibility on mobile and tablet devices.
                </p>
              </div>
            </div>
          </section>

          {/* Assistive Technologies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Compatible Assistive Technologies</h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Screen Readers</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• JAWS</li>
                  <li>• NVDA</li>
                  <li>• VoiceOver (macOS/iOS)</li>
                  <li>• TalkBack (Android)</li>
                  <li>• Narrator (Windows)</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Browser Tools</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Browser zoom (up to 200%)</li>
                  <li>• High contrast modes</li>
                  <li>• Dark/Light theme support</li>
                  <li>• Text-to-speech extensions</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Input Devices</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Keyboard-only navigation</li>
                  <li>• Switch controls</li>
                  <li>• Voice control</li>
                  <li>• Eye tracking devices</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Known Issues */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Known Limitations</h2>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <p className="text-amber-700 text-sm mb-3">
                While we strive for full accessibility, we acknowledge some areas that may need improvement:
              </p>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Some third-party embedded content may not be fully accessible</li>
                <li>• Certain complex interactive features are being enhanced for better accessibility</li>
                <li>• We're working on adding more language support for screen readers</li>
              </ul>
              <p className="text-amber-700 text-sm mt-3">
                We actively work to address these limitations and welcome your feedback.
              </p>
            </div>
          </section>

          {/* Feedback */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessibility Feedback</h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-medium text-green-900 mb-2">We Want to Hear From You</h3>
              <p className="text-green-700 text-sm mb-4">
                We welcome your feedback on the accessibility of our website. If you encounter any
                accessibility barriers or have suggestions for improvement, please contact us:
              </p>
              <div className="space-y-2">
                <p className="text-green-900 text-sm">
                  <span className="font-medium">Email:</span>{' '}
                  <a href="mailto:accessibility@linkist.ai" className="text-red-500 hover:text-red-600">
                    accessibility@linkist.ai
                  </a>
                </p>
                <p className="text-green-900 text-sm">
                  <span className="font-medium">Phone:</span>{' '}
                  <a href="tel:+15551234567" className="text-red-500 hover:text-red-600">
                    +1 (555) 123-4567
                  </a>
                </p>
                <p className="text-green-700 text-sm mt-3">
                  We aim to respond to accessibility feedback within 3 business days.
                </p>
              </div>
            </div>
          </section>

          {/* Continuous Improvement */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Continuous Improvement</h2>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Accessibility is an ongoing process. We regularly:
              </p>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✓</span>
                  <span>Conduct accessibility audits and testing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✓</span>
                  <span>Train our team on accessibility best practices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✓</span>
                  <span>Test with real users who use assistive technologies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✓</span>
                  <span>Update our website based on user feedback</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✓</span>
                  <span>Stay current with WCAG guidelines and updates</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Third-Party Content */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Content</h2>
            <p className="text-gray-700 leading-relaxed">
              Some content on our website may be provided by third-party services (payment processors,
              maps, analytics). While we strive to ensure these services are accessible, we cannot
              guarantee the accessibility of external content. We work with our third-party providers
              to improve accessibility where possible.
            </p>
          </section>

          {/* Legal */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Legal Compliance</h2>
            <p className="text-gray-700 leading-relaxed">
              Linkist is committed to complying with applicable accessibility laws and regulations,
              including but not limited to the Americans with Disabilities Act (ADA), Section 508
              of the Rehabilitation Act, and the European Accessibility Act (EAA).
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
