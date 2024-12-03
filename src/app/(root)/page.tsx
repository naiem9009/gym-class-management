import Hero from '@/components/hero'
import Features from '@/components/features'
import Footer from '@/components/Footer'
import SchedulePreview from '@/components/schedule-preview'
import Membership from '@/components/membership'
import Testimonials from '@/components/testimonials'

const Home = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <SchedulePreview />
      <Membership />
      <Testimonials />
      <Footer />
    </main>
  )
}


export default Home
