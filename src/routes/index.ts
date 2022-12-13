import { FC, lazy, LazyExoticComponent, ReactNode } from 'react'

export interface IRoute {
  path: string
  name?: string
  icon?: ReactNode | string
  redirect?: string
  hideInMenu?: boolean
  children?: IRoute[]
  element?: LazyExoticComponent<FC>
  errElement?: LazyExoticComponent<FC>
}

export const routes: IRoute[] = [
  {
    path: '/',
    redirect: '/home',
    element: lazy(async () => await import('@/layout/base')),
    errElement: lazy(async () => await import('@/pages/error')),
    children: [
      {
        path: '/home',
        element: lazy(async () => await import('@/pages/home'))
      }
    ]
  },
  {
    path: '/login',
    element: lazy(async () => await import('@/pages/login'))
  }
]
