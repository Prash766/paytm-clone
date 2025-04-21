"use client"

import { useEffect, useState } from "react"

interface TransactionLoaderProps {
  isOpen: boolean
  onClose?: () => void
}

export const TransactionLoader = ({ isOpen, onClose }: TransactionLoaderProps) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 1
          if (newProgress >= 100) {
            clearInterval(interval)
            return 100
          }
          return newProgress
        })
      }, 150)

      return () => clearInterval(interval)
    } else {
      setProgress(0)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-24 h-24">
            {/* Outer spinning circle */}
            <div className="absolute inset-0 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>

            {/* Inner pulsing circle */}
            <div className="absolute inset-4 bg-violet-100 rounded-full animate-pulse flex items-center justify-center">
              <svg className="w-8 h-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Processing Your Transaction</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Please wait while we securely process your payment...
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-violet-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">Do not close this window or refresh the page</p>
        </div>
      </div>
    </div>
  )
}
