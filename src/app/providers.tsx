'use client'

import { Provider, useDispatch } from 'react-redux'
import { AppDispatch, store } from '@/lib/store'
import { useEffect } from 'react'
import { setAuth } from '@/lib/features/auth/authSlice'
import { jwtVerify } from 'jose'
import { clearTokenCookie } from '@/actions/cookie'
import { CookiesProvider } from 'react-cookie';


const secret = new TextEncoder().encode(process.env.JWT_SECRET);


export const Providers = ({children} : {children : React.ReactNode}) => {
  return <CookiesProvider defaultSetOptions={{ path: '/' }}>
    <Provider store={store}>{children}</Provider>
  </CookiesProvider>
}


export const AuthProvider = ({children} : {children : React.ReactNode}) => {
  const dispatch = useDispatch<AppDispatch>()



  useEffect(() => {

    const getUserData = async () => {
      const storedState = localStorage.getItem('auth');
      const authData = storedState ? JSON.parse(storedState) : null;

      if (!authData) {
        clearTokenCookie()
      }
    
      try {

        if (authData?.user?.token) {
          const { payload } = await jwtVerify(authData?.user?.token, secret);

          dispatch(setAuth({
            user : {
              role : payload?.role, 
              token : authData?.user?.token, 
              _id : authData?.user?._id,
              name : authData?.user?.name,
              email : authData?.user?.email
            },
            isAuthenticated: authData?.isAuthenticated,
            loading: authData?.loading,
            error: authData?.error,
          }))
        }

        
      } catch (error) {
          console.error('Failed to verify token:', error);
          return null;
      }

    }

    getUserData()

    
    
  }, [dispatch])
  


  return children;
  
}

