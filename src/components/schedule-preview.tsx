'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/lib/store'
import { fetchTodaySchedules } from '@/lib/features/schedule/scheduleSlice'
import Link from 'next/link'

const SchedulePreview = () => {

  const dispatch = useDispatch<AppDispatch>();
  const {isAuthenticated} = useSelector((state:RootState) => state.auth)
  const { todaySchedules, loading, error } = useSelector((state:RootState) => state.schedule);

  useEffect(() => {
    dispatch(fetchTodaySchedules());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Todays Classes</h2>
        <div className="max-w-3xl mx-auto">
          {todaySchedules.length > 0 ? todaySchedules?.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between py-4 border-b"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div>
                Starting Time
                <p className="font-semibold">
                  {new Intl.DateTimeFormat('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                  }).format(new Date(`1970-01-01T${item?.endTime}:00`))}
                </p>
                <p className="text-gray-600">{item.className}</p>
              </div>

              <div>
                Ending Time
                <p className="font-semibold">
                  {new Intl.DateTimeFormat('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                  }).format(new Date(`1970-01-01T${item?.endTime}:00`))}
                </p>
              </div>


              <div className="text-right">
                <p className="text-gray-600">Instructor: {item.trainer?.name}</p>
                <Link href={!isAuthenticated ? "/login" : "/trainee"}>
                  <Button variant="outline" size="sm">Book Now</Button>
                </Link>
              </div>
            </motion.div>
          )) : <div className='font-bold text-center'>Not found</div>}
        </div>
        
      </div>
    </section>
  )
}

export default SchedulePreview