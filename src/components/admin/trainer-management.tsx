'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addTrainer, updateTrainer, deleteTrainer, Trainer } from '@/lib/features/trainer/trainerSlice'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppDispatch } from '@/lib/store'
import toast, { Toaster } from 'react-hot-toast'


interface TrainerManagementProps {
  trainers: Trainer[]
}

const TrainerManagement = ({ trainers }: TrainerManagementProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isOpen, setIsOpen] = useState(false)
  const [currentTrainer, setCurrentTrainer] = useState<Trainer | null>(null)
  const [name, setName] = useState('')
  const [password, setPassaword] = useState('')
  const [email, setEmail] = useState('')
  const [specialization, setSpecialization] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (currentTrainer) {
        const updateTrainerResult = await dispatch(updateTrainer({ _id: currentTrainer._id, name, email, specialization, password }))
        if (updateTrainer.fulfilled.match(updateTrainerResult)) {
          toast.success("Trainer Updated");
        }
        
      } else {
        const addTrainerResult = await dispatch(addTrainer({ name, email, specialization, password }))

        if (addTrainer.fulfilled.match(addTrainerResult)) {
          toast.success("Trainer Added");
        } 

        if (addTrainer.rejected.match(addTrainerResult)) {
          toast.error(addTrainerResult.error.message as string)
        }
      }
      setIsOpen(false)
      resetForm()
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while registering.")
      
    }
  }

  

  const handleEdit = (trainer: Trainer) => {
    setCurrentTrainer(trainer)
    setName(trainer.name)
    setEmail(trainer.email)
    setSpecialization(trainer.specialization)
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      const deleteTrainerResult = await dispatch(deleteTrainer(id))

      if (deleteTrainer.fulfilled.match(deleteTrainerResult)) {
        toast.success(deleteTrainerResult.payload?.message || "An error occurred while registering.");
      } else {
        toast.error(deleteTrainerResult.error.message|| "An error occurred while registering.");
      }
    }
  }

  const resetForm = () => {
    setCurrentTrainer(null)
    setName('')
    setEmail('')
    setSpecialization('')
  }

  return (
    <Card>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 1300
        }}
      />
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Manage Trainers</span>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>Add Trainer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{currentTrainer ? 'Edit Trainer' : 'Add Trainer'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassaword(e.target.value)}
                    required={currentTrainer ? false : true}
                  />
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit">
                  {currentTrainer ? 'Update Trainer' : 'Add Trainer'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainers?.map((trainer) => (
                <TableRow key={trainer._id}>
                  <TableCell>{trainer.name}</TableCell>
                  <TableCell>{trainer.email}</TableCell>
                  <TableCell>{trainer.specialization}</TableCell>
                  <TableCell>
                    <Button variant="ghost" onClick={() => handleEdit(trainer)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="ghost" onClick={() => handleDelete(trainer._id as unknown as string)} className="text-red-600 hover:text-red-800">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}


export default TrainerManagement



