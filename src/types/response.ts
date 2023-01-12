export interface Response<T> {
  data: T
  code: number
  msg: string
}

interface PageData<T> {
  content: T[]
  pages: number
  total: number
}

export interface PageResponse<T> extends Response<PageData<T>> {}
