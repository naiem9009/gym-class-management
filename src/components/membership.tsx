'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const plans = [
  {
    name: 'Basic',
    price: 29,
    features: [
      'Access to gym equipment',
      '2 group classes per week',
      'Locker room access',
      'Fitness assessment',
    ],
  },
  {
    name: 'Pro',
    price: 59,
    features: [
      'Unlimited gym access',
      'Unlimited group classes',
      'Personal trainer (2 sessions/month)',
      'Nutrition consultation',
      'Access to spa facilities',
    ],
  },
  {
    name: 'Elite',
    price: 99,
    features: [
      'All Pro features',
      'Unlimited personal training',
      'Customized meal plans',
      'Physical therapy sessions',
      'VIP locker room access',
    ],
  },
]

const Membership = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Membership Plans</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect membership plan to kickstart your fitness journey.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold">${plan.price}</span> / month
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Choose Plan</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Membership

