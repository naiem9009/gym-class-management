import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthUserState } from '../auth/authSlice'

interface User {
  _id: string
  email: string
  name : string
  role: 'admin' | 'trainer' | 'trainee'
}

export interface Schedule {
  _id?: string
  date: string
  startTime: string
  trainerId: string
  className: string
  participants?: User[]
  endTime?: string
  trainer? : User
}

interface ScheduleState {
  schedules: Schedule[]
  todaySchedules: Schedule[],
  loading: boolean
  error: string | null
}



export const fetchSchedules = createAsyncThunk(
  'schedule/fetchSchedules',
  async () => {
    const userState:AuthUserState | null = JSON.parse(localStorage.getItem('auth')!) || null;
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes/schedules`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState?.user?.token}`,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch schedules')
    }
    return await response.json()
  }
)



export const fetchTodaySchedules = createAsyncThunk(
  'schedule/fetchTodaySchedules',
  async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes/schedules/today`, {
      headers: { 
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message as string);
    }
    
    return data
  }
);


export const fetchTrainerSchedules = createAsyncThunk(
  'schedule/fetchTrainerSchedules',
  async (trainerId: string) => {
    const userState:AuthUserState | null = JSON.parse(localStorage.getItem('auth')!) || null;
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes/schedules/trainer/${trainerId}`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState?.user?.token}`,
      },
    })

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data?.message as string)
    }

    return data;
  }
)


export const fetchTraineeSchedule = createAsyncThunk(
  'schedule/fetchTraineeSchedule',
  async (traineeId: string) => {
    const userState:AuthUserState | null = JSON.parse(localStorage.getItem('auth')!) || null;
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes/schedules/trainee/${traineeId}`, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState?.user?.token}`,
      },
    })
    
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message as string)
    }

    return data;
  }
)

export const addSchedule = createAsyncThunk(
  'schedule/addSchedule',
  async (schedule: Omit<Schedule, 'id' | 'assignedTrainees'>) => {
    const userState:AuthUserState | null = JSON.parse(localStorage.getItem('auth')!) || null;
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes/create`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState?.user?.token}`,
      },
      body: JSON.stringify(schedule),
    })


    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message as string)
    }

    return data;
  }
)


export const updateSchedule = createAsyncThunk(
  'schedule/updateSchedule',
  async (schedule: Schedule) => {
    const userState:AuthUserState | null = JSON.parse(localStorage.getItem('auth')!) || null;
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes/schedules/update/${schedule._id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState?.user?.token}`,
      },
      body: JSON.stringify(schedule),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message as string)
    }
    return data
  }
)

export const deleteSchedule = createAsyncThunk(
  'schedule/deleteSchedule',
  async (id: string) => {
    const userState:AuthUserState | null = JSON.parse(localStorage.getItem('auth')!) || null;
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/classes/schedules/delete/${id}`, {
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
    return data;
  }
)

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    schedules: [],
    todaySchedules: [],
    loading: false,
    error: null,
  } as ScheduleState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false
        state.schedules = action.payload?.schedules
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch schedules'
      })
      .addCase(fetchTrainerSchedules.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTrainerSchedules.fulfilled, (state, action) => {
        state.loading = false
        state.schedules = action.payload?.data
      })
      .addCase(fetchTrainerSchedules.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch trainer schedules'
      })
      .addCase(addSchedule.fulfilled, (state, action) => {
        const existingSchedule = state.schedules.filter(s => s._id !== action.payload?.data?._id);
        const newSchedule = action.payload?.data;
        state.schedules = [newSchedule, ...existingSchedule];
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        const index = state.schedules.findIndex(s => s._id === action.payload?.data?._id)
        if (index !== -1) {
          state.schedules[index] = action.payload?.data
        }
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.schedules = state.schedules.filter(s => s._id !== action.payload?._id)
      })
      .addCase(fetchTraineeSchedule.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTraineeSchedule.fulfilled, (state, action) => {
        state.loading = false
        state.schedules = action.payload?.data
      })
      .addCase(fetchTraineeSchedule.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch trainee schedules'
      })

      .addCase(fetchTodaySchedules.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodaySchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.todaySchedules = action.payload.data;
      })
      .addCase(fetchTodaySchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trainee schedules'
      });
  },
})

export default scheduleSlice.reducer

