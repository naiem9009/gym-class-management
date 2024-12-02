import Navbar from "@/components/navbar"

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
    <div>
      <Navbar />
      {children}
    </div>
  )
}

