import { PageData } from './../../types/response'
import { baseApi } from './api'
import type { Response } from '@/types/response'

export interface Config {
  id: number
  group_id: number
  name: string
  map: string
}

export interface QueryConfigReq {
  group_id?: number
}

export const configApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getConfig: builder.query<Response<PageData<Config>>, QueryConfigReq>({
      query: (params) => ({
        url: '/config',
        params
      })
    })
  })
})

export const { useGetConfigQuery } = configApi
