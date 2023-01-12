import { PageResponse } from './../../types/response'
import { baseApi } from './api'
import type { Response } from '@/types/response'

export enum ConfigValueType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  IMAGE = 'image',
  VIDEO = 'video'
}

export interface ConfigValue {
  type: ConfigValueType
  value: string | number | boolean
  key: string
}

export interface Config {
  id: number
  group_id: number
  name: string
  values: ConfigValue[]
  created_at: string
  updated_at: string
}

export interface QueryConfigReq {
  group_id?: number
  name?: string
}

export interface UpdateConfigReq {
  id: number
  name?: string
  group_id?: number
  values?: ConfigValue[]
}

export interface CreateConfigReq {
  name: string
  group_id: number
}

export const configApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    configs: builder.query<PageResponse<Config>, QueryConfigReq>({
      query: (params) => ({
        url: '/configs',
        params
      }),
      providesTags: (result, error, params) =>
        result != null
          ? [
              ...result.data.content?.map(({ id }) => ({ type: 'Configs' as const, id })),
              { type: 'Configs', id: 'LIST' }
            ]
          : [{ type: 'Configs', id: 'LIST' }]
    }),
    getConfig: builder.query<Response<Config>, string>({
      query: (id) => `/config/${id}`,
      providesTags: (result, error, id) => [{ type: 'Configs', id }]
    }),
    createConfig: builder.mutation<Response<Config>, CreateConfigReq>({
      query: (body) => ({
        method: 'POST',
        url: '/config',
        body
      }),
      invalidatesTags: ['Configs']
    }),
    updateConfig: builder.mutation<Response<Config>, UpdateConfigReq>({
      query: ({ id, ...payload }) => ({
        url: `/config/${id}`,
        method: 'PATCH',
        body: payload
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Configs', id: arg.id }]
    }),
    deleteConfig: builder.mutation<Response<Config>, number>({
      query: (id) => ({
        method: 'DELETE',
        url: `/config/${id}`
      }),
      invalidatesTags: ['Configs']
    })
  })
})

export const {
  useConfigsQuery,
  useGetConfigQuery,
  useUpdateConfigMutation,
  useCreateConfigMutation,
  useDeleteConfigMutation
} = configApi
