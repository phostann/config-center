import { baseApi } from './api'
import { Response } from '@/types/response'

interface Profile {
  id: number
  email: string
  nickname: string
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getProfile: builder.query<Response<Profile>, void>({
      query: () => '/profile'
    })
  })
})

export const { useGetProfileQuery } = profileApi
