'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

// Icon aliases
const Plus = AddIcon;
const Minus = RemoveIcon;

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How does the NFC card work?",
    answer: "Simply tap your Linkist NFC card to any NFC-enabled smartphone and your digital profile will open automatically in their browser. No app installation required - it works instantly with built-in NFC technology."
  },
  {
    question: "Do recipients need the Linkist app?",
    answer: "No! The NFC card works with any smartphone that has NFC capability. Simply tap your card to any phone and your digital profile will open automatically - no app required."
  },
  {
    question: "Can I update my information after receiving the card?",
    answer: "Yes! Your digital profile is completely updateable. You can change your contact information, social links, and profile photo anytime through your Linkist dashboard. The card itself doesn't need to be replaced."
  },
  {
    question: "Which phones support NFC?",
    answer: "Most modern smartphones support NFC, including iPhone 7 and newer, and most Android phones from the last 5 years. The recipient's phone needs NFC capability to receive your information."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 5-7 business days within the US. Express shipping (2-3 days) is available for an additional fee. International orders may take 10-14 business days depending on location."
  },
  {
    question: "Is there a monthly fee?",
    answer: "No monthly fees! You pay once for your NFC card and can use it forever. Your digital profile hosting and updates are included with no recurring charges."
  },
  {
    question: "Can I have multiple profiles?",
    answer: "Currently, each NFC card is linked to one digital profile. However, you can easily switch between different sets of information (personal vs business) by updating your profile through the dashboard."
  },
  {
    question: "What's included in the mobile app?",
    answer: "The Linkist mobile app is coming in 2026 and will include advanced analytics, contact management, lead tracking, and enhanced customization options. Current features are accessible through our web dashboard."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about Linkist NFC cards
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-medium text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  {openIndex === index ? (
                    <Minus className="h-5 w-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </motion.div>
              </button>

              {/* Answer Content */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our support team is here to help you get the most out of your Linkist NFC card.
            </p>
            <motion.a
              href="mailto:support@linkist.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Contact Support
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}