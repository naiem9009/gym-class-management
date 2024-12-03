'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { login } from '@/lib/features/auth/authSlice'
import { motion } from 'framer-motion'
import { AppDispatch, RootState } from '@/lib/store'
import { LoaderIcon } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useCookies } from 'react-cookie';


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<string[] | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const {loading: loginLoading} = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const [cookies, setCookie] = useCookies(['token']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors(null)

    try {
      const loginResultAction = await dispatch(login({ email, password }))
      if (login.fulfilled.match(loginResultAction)) {
        toast.success("Login successful! Redirecting...");
        setCookie('token', loginResultAction.payload?.token)
        console.log(cookies.token);
        
        setTimeout(() => router.push(`/${loginResultAction.payload?.role}`), 1000)
      } else {
        toast.error(loginResultAction.error.message|| "An error occurred while registering.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while registering.")
      
    }
  }

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 1300
        }}
      />
      <motion.div
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">

            <div className='mb-4'>
              {errors && errors.map((error, index) => (
                <div key={index} className="text-red-500 text-sm">{error}</div>
              ))}
            </div>


            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loginLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {loginLoading ? <LoaderIcon className='animate-spin' /> : "Sign in"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default Login



