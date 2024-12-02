import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/lib/features/auth/authSlice'
import trainerReducer from '@/lib/features/trainer/trainerSlice'
import scheduleReducer from '@/lib/features/schedule/scheduleSlice'
import classReducer from '@/lib/features/class/classSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        trainer: trainerReducer,
        schedule: scheduleReducer,
        class: classReducer,
    },
})

// export store
export type RootState = ReturnType<typeof store.getState>

// export dispatch
export type AppDispatch = typeof store.dispatch


