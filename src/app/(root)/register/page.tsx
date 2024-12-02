'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '@/lib/features/auth/authSlice'
import { motion } from 'framer-motion'
import { AppDispatch, RootState } from '@/lib/store'
import { registerSchema } from '@/utils/validation'
import { z } from 'zod'
import toast, { Toaster } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { LoaderIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [errors, setErrors] = useState<string[] | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const {loading: registerLoading} = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors(null)

    try {
      registerSchema.parse({ fullName, email, password });
    
      const registerResultAction = await dispatch(register({ email, password, fullName }))

      if (register.fulfilled.match(registerResultAction)) {
        toast.success("Registration successful! Redirecting login page...");
      } else {
        toast.error(registerResultAction.error.message|| "An error occurred while registering.");
      }

      setTimeout(() => router.push('/login'), 1000)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: string[] = [];
        error.errors.forEach((err) => {
          newErrors.push(err.message)
        });
        setErrors(newErrors);
      }
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
            Create your account
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
              <label htmlFor="full-name" className="sr-only">
                Full Name
              </label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
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
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>


          <div>
            <Button
              type="submit"
              disabled={registerLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {registerLoading ? <LoaderIcon className='animate-spin' /> : "Register"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default Register
