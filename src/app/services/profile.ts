import { baseApi } from './api'
import { Response } from '@/types/response'

interface Profile {
  email: string
  id: number
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getProfile: builder.query<Response<Profile>, void>({
      query: () => '/user/profile'
    })
  })
})

export const { useGetProfileQuery } = profileApi
