'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addSchedule, updateSchedule, deleteSchedule, Schedule } from '@/lib/features/schedule/scheduleSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AppDispatch, RootState } from '@/lib/store'
import SelectInput from '../selectInput'
import toast, { Toaster } from 'react-hot-toast'
import { timeFormat } from '@/utils/dateTimeFormat'

interface ScheduleManagementProps {
  schedules: Schedule[]
}

const ScheduleManagement = ({ schedules }: ScheduleManagementProps) => {
  const {trainers} = useSelector((state: RootState) => state.trainer)
  const dispatch = useDispatch<AppDispatch>()
  const [isOpen, setIsOpen] = useState(false)
  const [currentSchedule, setCurrentSchedule] = useState<Schedule | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [trainerId, setTrainerId] = useState('')
  const [className, setClassName] = useState('')


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentSchedule) {
      const updateScheduleResult = await dispatch(updateSchedule({ _id: currentSchedule._id, date, startTime:time, trainerId, className, participants : [] }))

      if (updateSchedule.fulfilled.match(updateScheduleResult)) {
        toast.success(updateScheduleResult.payload?.message);
      } else {
        toast.error(updateScheduleResult.error?.message as string)
      }
    } else {
      const addScheduleResult = await dispatch(addSchedule({ date, startTime:time, trainerId, className }))

      if (addSchedule.fulfilled.match(addScheduleResult)) {
        toast.success(addScheduleResult.payload?.message);
      } else {
        toast.error(addScheduleResult.error?.message as string)
      }
    }
    setIsOpen(false)
    resetForm()
    
  }

  const trainerChangeHandler = (value : string) => {
    setTrainerId(value)
    
  }

  const handleEdit = (schedule: Schedule) => {
    setCurrentSchedule(schedule)
    setDate(schedule.date?.split('T')[0])
    setTime(schedule.startTime)
    setTrainerId(schedule?.trainer?._id as string)
    setClassName(schedule.className)
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      const deleteScheduleResult = await dispatch(deleteSchedule(id))

      if (deleteSchedule.fulfilled.match(deleteScheduleResult)) {
        toast.success(deleteScheduleResult.payload?.message as string)
      } else {
        toast.error(deleteScheduleResult.error?.message as string)
      }
    }
  }

  const resetForm = () => {
    setCurrentSchedule(null)
    setDate('')
    setTime('')
    setTrainerId('')
    setClassName('')
  }

  const validateSchedule = () => {
    const schedulesForDate = schedules?.length > 0 && schedules?.filter(s => s.date === date)
    if (schedulesForDate && schedulesForDate.length >= 5) {
      alert('Maximum 5 schedules per day allowed.')
      return false
    }
    return true
  }

  return (
    <div>
      <Toaster 
        position='bottom-right'
      />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Schedules</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Add Schedule</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentSchedule ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Starting Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <SelectInput
                  data={trainers || []}
                  onChangeHandler={trainerChangeHandler}
                  placeholder='Select a Trainer'
                  selectedValue={trainerId}
                />
              </div>
              <div>
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" onClick={validateSchedule}>
                {currentSchedule ? 'Update Schedule' : 'Add Schedule'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Starting Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ending Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules?.length > 0 && schedules.map((schedule) => (
              <tr key={schedule._id}>
                <td className="px-6 py-4 whitespace-nowrap">{schedule?.date?.split("T")[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {timeFormat(schedule?.startTime as string)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {timeFormat(schedule?.endTime as string)}
                </td>


                <td className="px-6 py-4 whitespace-nowrap">
                  <p className='font-semibold'>{schedule?.trainer?.name} <span className='font-normal'>({schedule?.trainer?.role})</span></p>
                  <p className='text-xs'>{schedule?.trainer?.email}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{schedule?.className}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="ghost" onClick={() => handleEdit(schedule)} className="text-indigo-600 hover:text-indigo-900 mr-2">
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(schedule._id as string)} className="text-red-600 hover:text-red-900">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


export default ScheduleManagement
