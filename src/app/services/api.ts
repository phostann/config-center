import { RootState } from '@/app/store'
import { AuthState, logout, setToken } from '@/components/auth/authSlice'
import type { Response } from '@/types/response'
import type { BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'

const BASE_URL = 'http://192.168.31.120:8989'

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const auth = (getState() as RootState).auth
      if (auth.access_token != null && auth.token_type != null && !headers.has('Authorization')) {
        headers.set('Authorization', `${auth.token_type} ${auth.access_token}`)
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
  if (result.error != null && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      const auth = (api.getState() as RootState).auth
      try {
        const res = await baseQuery(
          {
            url: '/refresh',
            method: 'POST',
            headers: {
              Authorization: `${auth.token_type ?? ''} ${auth.refresh_token ?? ''}`
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
        release()
      }
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({})
})
