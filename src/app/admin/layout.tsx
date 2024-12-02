export const metadata = {
  title: 'Admin - Gym Management System',
  description: 'Streamline your gym experience with Gym Pro',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>{children}</div>
  )
}
