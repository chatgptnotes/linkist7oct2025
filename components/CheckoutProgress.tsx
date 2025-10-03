'use client';

import { motion } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';

// Icon aliases
const Check = CheckIcon;

interface Step {
  id: string;
  name: string;
  description?: string;
}

interface CheckoutProgressProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export default function CheckoutProgress({ steps, currentStep, className = '' }: CheckoutProgressProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {steps[currentStep - 1]?.name}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="bg-red-500 h-2 rounded-full"
          />
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:block">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {steps.map((step, stepIdx) => {
              const stepNumber = stepIdx + 1;
              const isCompleted = stepNumber < currentStep;
              const isCurrent = stepNumber === currentStep;

              return (
                <li
                  key={step.id}
                  className={`${
                    stepIdx !== steps.length - 1 ? 'flex-1' : ''
                  } relative`}
                >
                  <div className="flex items-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: stepIdx * 0.1 }}
                      className="relative flex items-center justify-center"
                    >
                      {isCompleted ? (
                        <div className="h-10 w-10 rounded-full bg-red-500 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      ) : isCurrent ? (
                        <div className="h-10 w-10 rounded-full border-2 border-red-500 bg-red-500 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {stepNumber}
                          </span>
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                          <span className="text-gray-500 font-medium">
                            {stepNumber}
                          </span>
                        </div>
                      )}
                    </motion.div>

                    {stepIdx !== steps.length - 1 && (
                      <div className="flex-1 ml-4">
                        <div className="h-0.5 bg-gray-200 relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: isCompleted ? '100%' : '0%'
                            }}
                            transition={{ duration: 0.3, delay: stepIdx * 0.1 }}
                            className="absolute inset-0 h-0.5 bg-red-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="mt-2">
                    <span
                      className={`text-sm font-medium ${
                        isCompleted || isCurrent
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                    {step.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}