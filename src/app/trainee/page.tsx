'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { AppDispatch, RootState } from '@/lib/store'
import { fetchAvailableClasses, bookClass } from '@/lib/features/class/classSlice'
import { fetchTraineeSchedule } from '@/lib/features/schedule/scheduleSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { timeFormat } from '@/utils/dateTimeFormat'
import { LoaderIcon } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { updateProfile } from '@/lib/features/auth/authSlice'
import Profile from '@/components/profile'

export default function TraineeDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { availableClasses, loading: classLoading } = useSelector((state: RootState) => state.class)
  const { schedules, loading: scheduleLoading } = useSelector((state: RootState) => state.schedule)
  
  useEffect(() => {
      if (user && user?._id) {
          dispatch(fetchAvailableClasses())
          dispatch(fetchTraineeSchedule(user._id))
      }
  }, [dispatch, user])  
  
    
  const handleBookClass = async (classScheduleId: string, className : string) => {
      if (user && user?._id) {
        if (window.confirm(`Are you sure you want to book this ${className} Class?`)) {
          const bookClassResult = await dispatch(bookClass({ classScheduleId }))
          if (bookClass.fulfilled.match(bookClassResult)) {
            toast.success(bookClassResult.payload?.message)
          } else {
            toast.error(bookClassResult.error?.message as string)
          }
          await dispatch(fetchTraineeSchedule(user._id))
        }
      }
  }

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      const name = formData.get('name') as string
      const email = formData.get('email') as string

      if (user && user._id) {
          const updateProfileResult = await dispatch(updateProfile({ name, email }))

          if (updateProfile.fulfilled.match(updateProfileResult)) {
            toast.success(updateProfileResult.payload?.message as string)
          } else {
            toast.error(updateProfileResult.error?.message as string)
          }
      }
  }
    

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster 
        position='bottom-right'
      />
      <div className='flex items-center justify-between'>
        <h1 className="text-3xl font-bold mb-8">Trainee Dashboard</h1>
        <Profile
          name={user?.name as string}
          role={user?.role as string}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Available Classes</CardTitle>
              <CardDescription>Book your next workout session</CardDescription>
            </CardHeader>
            <CardContent>
              {classLoading && <div className='flex items-center justify-center'>
                <LoaderIcon className='animate-spin' />
              </div>}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Starting Time</TableHead>
                    <TableHead>Ending Time</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!classLoading && availableClasses?.length > 0 && availableClasses.map((cls) => (
                    <TableRow key={cls._id}>
                      <TableCell>{cls.className}</TableCell>
                      <TableCell>{cls.date?.split("T")[0]}</TableCell>
                      <TableCell>{timeFormat(cls.startTime)}</TableCell>
                      <TableCell>{timeFormat(cls.endTime)}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleBookClass(cls._id, cls.className)}>Book</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Schedule</CardTitle>
              <CardDescription>Upcoming classes you have booked</CardDescription>
            </CardHeader>
            <CardContent>
              {scheduleLoading && <div className='flex items-center justify-center'>
                <LoaderIcon className='animate-spin' />
              </div>}
              <Table>
                <TableCaption>Your upcoming classes</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!scheduleLoading && schedules?.length > 0 && schedules.map((cls) => (
                    <TableRow key={cls._id}>
                      <TableCell>{cls.className}</TableCell>
                      <TableCell>{cls.date?.split("T")[0]}</TableCell>
                      <TableCell>{timeFormat(cls.startTime)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Profile Management</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={user?.name} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={user?.email} />
                  </div>
                </div>
                <CardFooter className="flex justify-end mt-4">
                  <Button type="submit">Update Profile</Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

