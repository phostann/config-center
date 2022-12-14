import { RootState } from '@/app/store'
import { AuthState, setToken, logout } from '@/components/auth/authSlice'
import type { BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Response } from '@/types/response'
import { Mutex } from 'async-mutex'

const BASE_URL = 'http://localhost:3000/api/v1'

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access_token
      if (token != null && !headers.has('Authorization')) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }
  })

const mutex = new Mutex()
const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock()
  const result = await baseQuery(args, api, extraOptions)
  let data = result.data as Response<any>
  // token is missing or invalid
  if (result.error == null && (data.code === 20004 || data.code === 20003)) {
    if (!mutex.isLocked()) {
      const realease = await mutex.acquire()
      const state = api.getState() as RootState
      try {
        const res = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            headers: {
              Authorization: `Bearer ${state.auth.refresh_token ?? ''}`
            }
          },
          api,
          extraOptions
        )
        // if refresh token is invalid, redirect to login page
        if (res.error != null) {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          return result
        }
        data = res.data as Response<AuthState>
        if (data.code === 0) {
          localStorage.setItem('auth', JSON.stringify(data.data))
          api.dispatch(setToken(data.data))
          return await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch(logout)
        }
      } catch (error) {
        console.error(error)
      } finally {
        realease()
      }
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReAuth,
  tagTypes: [],
  endpoints: () => ({})
})
