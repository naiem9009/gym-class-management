'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    name: 'Fuyadul Islam',
    role: 'Fitness Enthusiast',
    image: 'https://cdn.sanity.io/images/v8dzphqs/production/0a896dcbcacde5a93f0435b2cab4418eaaea091c-846x1122.jpg',
    content: 'The class scheduling system has made it so easy to plan my workouts. I never miss a class now!',
  },
  {
    name: 'Tanjimul Nahid',
    role: 'Gym Owner',
    image: 'https://cdn.sanity.io/images/v8dzphqs/production/efd0edfd8f194875d37e41b9fccd86e69705d754-1080x1446.jpg',
    content: 'This management system has streamlined our operations and improved member satisfaction significantly.',
  },
  {
    name: 'Emon Khan',
    role: 'Yoga Instructor',
    image: 'https://cdn.sanity.io/images/v8dzphqs/production/989ba766e8e2961a37f5830af8609cc4079b0204-956x960.jpg',
    content: 'The attendance tracking feature helps me better understand my class popularity and adjust accordingly.',
  },
]

const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Members Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from our satisfied members about their experiences with our gym and management system.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{testimonial.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

