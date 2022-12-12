export interface Response<T> {
  code: number
  msg: string
  data: T
}

export interface PageData<T> {
  total: number
  content: T[]
  page: number
  page_size: number
}
