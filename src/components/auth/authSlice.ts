import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

export interface AuthState {
  access_token: string | null
  refresh_token: string | null
}
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const initialState = {
  access_token: null,
  refresh_token: null
} as AuthState

export const authSlice = createSlice({
  name: 'auth',
  initialState: function (): AuthState {
    const auth = localStorage.getItem('auth')
    if (auth != null) {
      return JSON.parse(auth)
    }
    return initialState
  },
  reducers: {
    logout(state: AuthState) {
      state.access_token = null
      state.refresh_token = null
    },
    setToken(state: AuthState, action: PayloadAction<AuthState>) {
      state.access_token = action.payload.access_token
      state.refresh_token = action.payload.refresh_token
    }
  }
})

export const { logout, setToken } = authSlice.actions

export const selectToken = (state: RootState): RootState['auth']['access_token'] =>
  state.auth.access_token
