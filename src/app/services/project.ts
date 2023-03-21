import { PageResponse } from '@/types/response'
import { baseApi } from './api'

export interface Project {
  id: number
  name: string
  repo: string
  repo_id: number
  user_id: number
  user_name: string
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
  repo: string
  repo_id: number
  description: string
}

export interface UpdateProjectReq {
  id: number
  name: string
  repo: string
  repo_id: number
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
        url: `/project/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Projects']
    }),
    addProject: builder.mutation<Project, AddProjectReq>({
      query: (project) => ({
        url: '/project',
        method: 'POST',
        body: project
      }),
      invalidatesTags: ['Projects']
    }),
    updateProject: builder.mutation<Project, UpdateProjectReq>({
      query: (project) => ({
        url: `/project/${project.id}`,
        method: 'PATCH',
        body: {
          name: project.name,
          repo: project.repo,
          repo_id: project.repo_id,
          description: project.description
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
