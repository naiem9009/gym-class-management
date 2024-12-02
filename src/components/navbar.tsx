'use client'

import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'


import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'


export default function Navbar() {

  const {isAuthenticated, user} = useSelector((state: RootState) => state.auth)
  const pathname = usePathname()


  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()

  
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '#features' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-purple-600">
              Gym Pro
            </Link>
          </div>
          { (!pathname.includes("login") && !pathname.includes("register")) && <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isScrolled
                      ? 'text-gray-700 hover:text-purple-600'
                      : 'text-white hover:bg-white/10'
                  } transition-colors duration-300`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div> }

          <div className="hidden md:block">
            <div className="space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href={user?.role === 'admin' ? '/admin' : user?.role === "trainer" ? "/trainer" : "trainee"}>
                    <Button variant="ghost" className='text-green-500'>Dashboard</Button>
                  </Link>
                </>
              ) : ( 
                <Link href={pathname.includes("/register") ? '/login' : '/register'}>
                  <Button
                    className={`${
                      isScrolled
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-white text-purple-600 hover:bg-purple-100'
                    } transition-colors duration-300`}

                  >
                    {pathname.includes("login") ? "Register" : pathname.includes("register") ? "Login" : "Sign Up"}
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                (!pathname.includes("login") && !pathname.includes("register")) ? isScrolled ? 'text-gray-700' : 'text-white' : 'text-gray-800'
              } hover:bg-purple-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}
            >
              <span className="sr-only">Main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      
      {/* Mobile menu */}
      <motion.div
        className={`md:hidden ${isScrolled ? 'bg-white' : 'bg-purple-600'}`}
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 }
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isScrolled
                  ? 'text-gray-700 hover:text-purple-600'
                  : 'text-white hover:bg-white/10'
              } transition-colors duration-300`}
            >
              {item.name}
            </Link>
          ))}
          <Link href={'/register'}>
            <Button
              className={`w-full mt-4 ${
                isScrolled
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-white text-purple-600 hover:bg-purple-100'
              } transition-colors duration-300`}
            >
              Sign Up
            </Button>
          </Link>

          <Link href={'/login'}>
            <Button
              className={`w-full mt-2 ${
                isScrolled
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-white text-purple-600 hover:bg-purple-100'
              } transition-colors duration-300`}
            >
              Login
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  )
}



