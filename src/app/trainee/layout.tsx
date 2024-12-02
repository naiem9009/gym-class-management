export const metadata = {
  title: 'Trainee - Gym Management System',
  description: 'Streamline your gym experience with Gym Pro',
}

  
  export default function TraineeLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div>{children}</div>
    )
  }
  