import { baseApi } from './api'
import type { Response } from '@/types/response'

export interface Config {
  group_id: number
  name: string
  map: string
}

export const configApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getConfig: builder.query<Response<Config>, void>({
      query: () => '/config'
    })
  })
})

export const { useGetConfigQuery } = configApi
