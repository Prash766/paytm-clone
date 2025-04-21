import { data, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axiosClient from '../axiosClient'
import { Loader } from 'lucide-react'

export default function Login({
  isLoggedIn,
  setIsLoggedIn,
}: {
  isLoggedIn: boolean
  setIsLoggedIn: (status: boolean) => void
}) {
  const location = useLocation();
  const navigate = useNavigate()

  console.log("redirecturl",location.state)

  // State variables for email and password
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading , setIsLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn && location.state?.redirect) {
      navigate(location.state.redirect, { replace: true });
    }
  }, [isLoggedIn]);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await axiosClient.post('/login', {email, password});
      
      if(res.status === 200) {
        setIsLoggedIn(true);
        // The useEffect above will handle the redirect
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    return () => {
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <Link to="/" className="text-2xl font-bold">
            SecureBank
          </Link>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Login to Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit" 
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
              >
                {
                  isLoading ? <Loader className='w-5 h-5 animate-pulse'/> : "Sign In"
                }
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 mt-16 text-white py-6">
        <div className="container mx-auto text-center">
          <p>© 2024 SecureBank. This is a fake banking application for demonstration purposes only.</p>
        </div>
      </footer>
    </div>
  )
}
