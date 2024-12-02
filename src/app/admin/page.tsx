'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { AppDispatch, RootState } from '@/lib/store'
import { fetchTrainers } from '@/lib/features/trainer/trainerSlice'
import { fetchSchedules } from '@/lib/features/schedule/scheduleSlice'
import TrainerManagement from '@/components/admin/trainer-management'
import ScheduleManagement from '@/components/admin/schedule-management'

import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import Profile from '@/components/profile'

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { trainers, loading: trainerLoading, error: trainerError } = useSelector((state: RootState) => state.trainer)
  const { schedules, loading: scheduleLoading, error: scheduleError } = useSelector((state: RootState) => state.schedule)
  const [activeTab, setActiveTab] = useState("trainers")
  const { user } = useSelector((state: RootState) => state.auth)
  

  useEffect(() => {
    dispatch(fetchTrainers())
    dispatch(fetchSchedules())
  }, [dispatch])


  if (trainerLoading || scheduleLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (trainerError || scheduleError) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {trainerError || scheduleError}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex items-center justify-between'>
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <Profile
          name={user?.name as string}
          role={user?.role as string}
        />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="trainers">Trainer Management</TabsTrigger>
          <TabsTrigger value="schedules">Schedule Management</TabsTrigger>
        </TabsList>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TabsContent value="trainers">
            <TrainerManagement trainers={trainers} />
          </TabsContent>
          
          <TabsContent value="schedules">
            <ScheduleManagement schedules={schedules} />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  )
}

export default AdminDashboard


