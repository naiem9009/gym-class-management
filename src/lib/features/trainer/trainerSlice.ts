import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthUserState } from '../auth/authSlice';

export interface Trainer {
  _id?: string
  name: string
  email: string
  password : string;
  specialization: string
}

interface TrainerState {
  trainers: Trainer[]
  loading: boolean
  error: string | null
}

export const fetchTrainers = createAsyncThunk(
  'trainer/fetchTrainers',
  async () => {
    const userState:AuthUserState | null = JSON.parse(localStorage.getItem('auth')!);
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/trainers`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState?.user?.token}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch trainers')
    }
    return await response.json()
  }
)

export const addTrainer = createAsyncThunk(
  'trainer/addTrainer',
  async (trainer: Omit<Trainer, 'id'>) => {
    const userState:AuthUserState | null = JSON.parse(localStorage.getItem('auth')!);
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/trainers/create`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState?.user?.token}`,
      },
      body: JSON.stringify(trainer),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message as string)
    }
    return data
  }
)


export const updateTrainer = createAsyncThunk(
  'trainer/updateTrainer',
  async (trainer: Trainer) => {
    const userState:AuthUserState | null = JSON.parse(localStorage.getItem('auth')!);
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/trainers/update/${trainer._id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState?.user?.token}`,
      },
      body: JSON.stringify(trainer),
    })
    if (!response.ok) {
      throw new Error('Failed to update trainer')
    }
    return await response.json()
  }
)

export const deleteTrainer = createAsyncThunk(
  'trainer/deleteTrainer',
  async (id: string) => {
    const userState:AuthUserState | null = JSON.parse(localStorage.getItem('auth')!);
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/trainers/delete/${id}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState?.user?.token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message as string)
    }
    return data
  }
)

const trainerSlice = createSlice({
  name: 'trainer',
  initialState: {
    trainers: [],
    loading: false,
    error: null,
  } as TrainerState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.loading = false
        state.trainers = action.payload
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch trainers'
      })
      .addCase(addTrainer.fulfilled, (state, action) => {
        const existingTrainers = state.trainers.filter(t => t._id !== action.payload._id);
        const newTrainer = action.payload;

        state.trainers = [newTrainer, ...existingTrainers];
      })
      .addCase(updateTrainer.fulfilled, (state, action) => {
        const index = state.trainers.findIndex(t => t._id === action.payload._id)
        if (index !== -1) {
          state.trainers[index] = action.payload
        }
      })
      .addCase(deleteTrainer.fulfilled, (state, action) => {
        console.log(action);
        
        state.trainers = state.trainers.filter(t => t._id !== action.payload?._id)
      })
  },
})

export default trainerSlice.reducer

