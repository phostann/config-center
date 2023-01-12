import { baseApi } from './services/api'
import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from '@/components/auth/authSlice'
import { rtkQueryErrorLogger } from './middleware'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [authSlice.name]: authSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, rtkQueryErrorLogger)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
