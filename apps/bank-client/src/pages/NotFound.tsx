import {Link} from "react-router-dom"
import { AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <Link to="/" className="text-2xl font-bold">
            SecureBank
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4 flex-grow flex items-center justify-center">
        <div className="max-w-lg w-full mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <AlertTriangle size={80} className="text-blue-800" />
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">
                ₹
              </div>
            </div>
          </div>

          <h1 className="text-7xl font-bold text-gray-500 mb-8">OOPS</h1>

          <p className="text-xl text-gray-700 mb-6">Something went wrong. It may be due to any of these reasons:</p>

          <ul className="text-gray-600 mb-8 space-y-2">
            <li>Session expired due to inactivity</li>
            <li>Our system encountered an obstacle</li>
            <li>The page you're looking for doesn't exist</li>
          </ul>

          <div className="mb-8">
            <h2 className="text-xl font-medium text-gray-700 mb-4">You can fix it yourself! Here's how:</h2>

            <ul className="text-gray-600 space-y-3">
              <li>Check payment status with your bank to avoid double payment</li>
              <li>Clear cookies & temporary internet files of the browser & retry</li>
              <li>Launch a new browser & start from the beginning</li>
            </ul>
          </div>

          <p className="text-gray-600 mb-6">
            Still unable to transact? visit us at{" "}
            <Link to="/" className="text-green-600 hover:text-green-700 font-medium">
              securebank.com/help
            </Link>
          </p>

          <Link to="/">
            <button className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
              Return to Home
            </button>
          </Link>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>© 2024 SecureBank. This is a fake banking application for demonstration purposes only.</p>
        </div>
      </footer>
    </div>
  )
}
