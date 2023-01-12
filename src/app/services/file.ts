import { baseApi } from './api'
import { Response } from '@/types/response'

export const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    upload: builder.mutation<Response<string>, FormData>({
      query: (data) => ({
        method: 'POST',
        url: '/upload',
        body: data
      })
    })
  })
})

export const { useUploadMutation } = fileApi
