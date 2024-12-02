import '@/app/globals.css'
import { Inter } from 'next/font/google'
import {AuthProvider, Providers} from '@/app/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gym Pro - Gym Management System',
  description: 'Streamline your gym experience with Gym Pro',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Providers>
      
        <html lang="en">
          <body className={inter.className}>
          <AuthProvider>{children}</AuthProvider>
          </body>
        </html>
      
    </Providers>

  )
}

