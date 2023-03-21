import type { Response, PageResponse } from './../../types/response'
import { baseApi } from './api'

export interface Group {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface QueryGroupReq {
  name?: string
}

export interface CreateGroupReq {
  name?: string
}

export interface UpdateGroupReq {
  id: number
  name?: string
}

const enhanced = baseApi.enhanceEndpoints({
  addTagTypes: ['Groups']
})

export const groupApi = enhanced.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    groups: builder.query<PageResponse<Group>, QueryGroupReq>({
      query: (params) => ({
        method: 'GET',
        url: '/groups',
        params
      }),
      providesTags: (result, error, params) =>
        result != null
          ? [
              ...result.data.content?.map(({ id }) => ({ type: 'Groups' as const, id })),
              { type: 'Groups', id: 'LIST' }
            ]
          : [{ type: 'Groups', id: 'LIST' }]
    }),
    createGroup: builder.mutation<Response<Group>, CreateGroupReq>({
      query: (body) => ({
        method: 'POST',
        url: '/group',
        body
      }),
      invalidatesTags: ['Groups']
    }),
    updateGroup: builder.mutation<Response<Group>, UpdateGroupReq>({
      query: ({ id, ...payload }) => ({
        method: 'PATCH',
        url: `/group/${id}`,
        body: payload
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Groups', id: arg.id }]
    }),
    deleteGroup: builder.mutation<Response<string>, number>({
      query: (id) => ({
        method: 'DELETE',
        url: `/group/${id}`
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Groups', id }]
    })
  })
})

export const {
  useGroupsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation
} = groupApi
