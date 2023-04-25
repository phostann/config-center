import { PageResponse } from '@/types/response'
import { baseApi } from './api'

export interface Project {
  id: number
  name: string
  ssh_url: string
  http_url: string
  web_url: string
  pid: number
  user_id: number
  username: string
  badge: string
  category: string
  tags: string[]
  build_cmd: string
  dist: string
  description: string
  created_at: string
  updated_at: string
}

export interface QueryProjectReq {
  name?: string
  description?: string
  page: number
  page_size: number
}

export interface AddProjectReq {
  name: string
  ssh_url: string
  http_url: string
  web_url: string
  pid: number
  user_id: number
  username: string
  badge: string
  category: string
  tags: string[]
  build_cmd: string
  dist: string
  description: string
}

export interface UpdateProjectReq {
  id: number
  name: string
  ssh_url: string
  http_url: string
  web_url: string
  pid: number
  user_id: number
  username: string
  badge: string
  category: string
  tags: string[]
  build_cmd: string
  dist: string
  description: string
}

const enhanced = baseApi.enhanceEndpoints({
  addTagTypes: ['Projects']
})

const projectApi = enhanced.injectEndpoints({
  endpoints: (builder) => ({
    projects: builder.query<PageResponse<Project>, QueryProjectReq>({
      query: (params) => ({
        url: '/projects',
        params
      }),
      providesTags: (result, error, params) =>
        result != null
          ? [
              ...result.data.content?.map(({ id }) => ({ type: 'Projects' as const, id })),
              { type: 'Projects', id: 'LIST' }
            ]
          : [{ type: 'Projects', id: 'LIST' }]
    }),
    deleteProject: builder.mutation<any, number>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Projects']
    }),
    addProject: builder.mutation<Project, AddProjectReq>({
      query: (project) => ({
        url: '/projects',
        method: 'POST',
        body: project
      }),
      invalidatesTags: ['Projects']
    }),
    updateProject: builder.mutation<Project, UpdateProjectReq>({
      query: (project) => ({
        url: `/projects/${project.id}`,
        method: 'PATCH',
        body: {
          ...project
        }
      }),
      invalidatesTags: ['Projects']
    })
  })
})

export const {
  useProjectsQuery,
  useDeleteProjectMutation,
  useAddProjectMutation,
  useUpdateProjectMutation
} = projectApi
