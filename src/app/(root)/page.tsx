import Hero from '@/components/hero'
import Features from '@/components/features'
import Footer from '@/components/Footer'
import SchedulePreview from '@/components/schedule-preview'

const Home = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <SchedulePreview />
      <Footer />
    </main>
  )
}


export default Home
