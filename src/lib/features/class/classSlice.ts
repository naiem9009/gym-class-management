import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthUserState } from '../auth/authSlice'

interface Class {
  _id: string
  className: string
  date: string
  startTime: string
  endTime : string
}

interface ClassState {
  availableClasses: Class[]
  loading: boolean
  error: string | null
}

export const fetchAvailableClasses = createAsyncThunk(
  'class/fetchAvailableClasses',
  async () => {
    const userState:AuthUserState | null = JSON.parse(localStorage.getItem('auth')!) || null;
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes/available`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState?.user?.token}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch available classes')
    }
    return await response.json()
  }
)

export const bookClass = createAsyncThunk(
  'class/bookClass',
  async ({ classScheduleId }: { classScheduleId: string }) => {
    const userState:AuthUserState | null = JSON.parse(localStorage.getItem('auth')!) || null;
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes/book`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState?.user?.token}`,
      },
      body: JSON.stringify({ classScheduleId }),
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message as string)
    }
    return data
  }
)

const classSlice = createSlice({
  name: 'class',
  initialState: {
    availableClasses: [],
    loading: false,
    error: null,
  } as ClassState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableClasses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAvailableClasses.fulfilled, (state, action) => {
        state.loading = false
        state.availableClasses = action.payload?.data
      })
      .addCase(fetchAvailableClasses.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch available classes'
      })
      .addCase(bookClass.fulfilled, (state, action) => {
        state.availableClasses = state.availableClasses.filter(cls => cls._id !== action.payload?.data?._id)
      })
  },
})

export default classSlice.reducer

