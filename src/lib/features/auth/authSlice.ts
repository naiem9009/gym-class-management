import { clearTokenCookie } from '@/actions/cookie'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


interface User {
  _id: string
  email: string
  name : string
  token: string
  role: 'admin' | 'trainer' | 'trainee'
}

export interface AuthUserState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}


const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
} as AuthUserState;



export const updateProfile = createAsyncThunk(
  'auth/updateUser',
  async (updatedUserData: Partial<User>) => {
    const userState: AuthUserState | null = JSON.parse(localStorage.getItem('auth')!);
    
    if (!userState?.user?.token) {
      throw new Error('User is not authenticated');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/profile-update`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState?.user?.token}`,
      },
      body: JSON.stringify(updatedUserData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message as string);
    }

    const newAuthState = {
      ...userState,
      user: { ...userState.user, ...data?.data },
    };

    localStorage.setItem('auth', JSON.stringify(newAuthState));

    return data;
  }
);


export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { 
    email: string; 
    password: string 
  }) => {
    const userState:AuthUserState | null = JSON.parse(localStorage.getItem('auth')!);
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userState?.user?.token}`,
      },
      credentials : "include",
      body: JSON.stringify({ email, password }),
    })


    const data = await response.json()


    if (!response.ok) {
      throw new Error(data?.message as string)
    }

    localStorage.setItem("auth", JSON.stringify({
      user: data,
      isAuthenticated: true,
      loading: false,
      error: null,
    }))
    return data
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, fullName }: { 
    email: string; 
    password: string; 
    fullName: string 
  }) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data?.message as string)
    }

    return data
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false

      localStorage.clear()
      clearTokenCookie()
    },

    setAuth: (state, action) => {
      state.user = action.payload.user
      state.error = action.payload.error
      state.isAuthenticated = action.payload.isAuthenticated
      state.loading = action.payload.loading
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.error.message || 'Login failed'
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.error.message || 'Registration failed'
      })


  },
})

export const { logout, setAuth } = authSlice.actions

export default authSlice.reducer

