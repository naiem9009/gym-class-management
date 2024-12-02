import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { AppDispatch } from '@/lib/store'
import { useDispatch } from 'react-redux'
import { logout } from '@/lib/features/auth/authSlice'

const Profile = ({name, role} : {name : string, role : string}) => {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()

    const handleLogout = () => {
        dispatch(logout())
        router.push('/login')
        
    }

  return (
    <div className='flex items-center gap-4'>
      <div>
        <p className='font-semibold'>{name}</p>
        <p className='font-xs text-gray-400'>{role}</p>
      </div>

      <Button variant={"destructive"} onClick={handleLogout}>Logout</Button>
    </div>

  )
}

export default Profile