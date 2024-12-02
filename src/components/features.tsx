'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, BarChart, Workflow } from 'lucide-react'

const features = [
  {
    icon: Calendar,
    title: 'Easy Scheduling',
    description: 'Book classes with just a few clicks',
  },
  {
    icon: Users,
    title: 'Member Management',
    description: 'Effortlessly manage your gym community',
  },
  {
    icon: Workflow,
    title: 'Fast Workout',
    description: 'Seamless fast workout process',
  },
  {
    icon: BarChart,
    title: 'Insightful Analytics',
    description: 'Track performance and growth',
  },
]

const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


export default Features
