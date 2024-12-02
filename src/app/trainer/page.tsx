'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/lib/store'
import { fetchTrainerSchedules } from '@/lib/features/schedule/scheduleSlice'
import { motion } from 'framer-motion'
import { timeFormat } from '@/utils/dateTimeFormat'
import Profile from '@/components/profile'


const TrainerDashboard = () => {
  
  const dispatch = useDispatch<AppDispatch>()
  const { schedules, loading, error } = useSelector((state: RootState) => state.schedule)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchTrainerSchedules(user._id))
    }
  }, [dispatch, user])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  
console.log(schedules);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex items-center justify-between'>
        <h1 className="text-3xl font-bold mb-8">Trainer Dashboard</h1>
        <Profile 
          name={user?.name as string}
          role={user?.role as string}
        />
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starting Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Trainees</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            { schedules?.length > 0 && schedules.map((schedule, index) => (
              <motion.tr
                key={schedule._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">{schedule?.className}</td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule.date?.split("T")[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{timeFormat(schedule.startTime)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs">
                  {schedule?.participants?.map((trainee, index) => (
                    <span key={index}>{trainee?.name}, </span>
                  ))}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TrainerDashboard
