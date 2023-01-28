import { baseApi } from './api'
import { PageResponse, Response } from '@/types/response'

export interface Template {
  id: number
  name: string
  repo: string
  brief: string
  kind: string
  tags: string[]
}

export interface QueryTemplateReq {
  name?: string
  tag?: string
}

export interface CreateTemplateReq {
  name: string
  brief: string
  kind: string
  repo: string
}

export interface UpdateTemplateReq {
  id: number
  name?: string
  brief?: string
  kind?: string
  repo?: string
  tags?: string[]
}

const enhanced = baseApi.enhanceEndpoints({
  addTagTypes: ['Templates']
})

const templateApi = enhanced.injectEndpoints({
  endpoints: (builder) => ({
    templates: builder.query<PageResponse<Template>, QueryTemplateReq>({
      query: (params) => ({
        url: '/templates',
        params
      }),
      providesTags: (result, error, params) =>
        result != null
          ? [
              ...result.data.content?.map(({ id }) => ({ type: 'Templates' as const, id })),
              { type: 'Templates', id: 'LIST' }
            ]
          : [{ type: 'Templates', id: 'LIST' }]
    }),
    createTemplate: builder.mutation<Response<Template>, CreateTemplateReq>({
      query: (body) => ({
        url: '/template',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Templates']
    }),
    updateTemplate: builder.mutation<Response<Template>, UpdateTemplateReq>({
      query: ({ id, ...payload }) => ({
        url: `/template/${id}`,
        method: 'PATCH',
        body: payload
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Templates', id: arg.id }]
    }),
    deleteTemplate: builder.mutation<Response<void>, number>({
      query: (id) => ({
        url: `/template/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Templates' as const, id }]
    })
  })
})

export const {
  useTemplatesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation
} = templateApi
