import { baseApi } from './api'
import type { Response, PageData } from './../../types/response'

export interface Group {
  id: number
  name: string
}

export const groupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    groups: builder.query<Response<PageData<Group>>, void>({
      query: () => '/group'
    })
  })
})

export const { useGroupsQuery } = groupApi
