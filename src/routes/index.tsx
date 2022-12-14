import React, { FC, lazy, LazyExoticComponent, ReactNode } from 'react'
import { FileTextOutlined, HomeOutlined } from '@ant-design/icons'

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
    icon: <HomeOutlined />,
    name: '首页',
    element: lazy(async () => await import('@/layout/base')),
    errElement: lazy(async () => await import('@/pages/error')),
    children: [
      {
        path: '/home',
        name: '首页',
        hideInMenu: true,
        element: lazy(async () => await import('@/pages/home'))
      },
      {
        path: '/config',
        icon: <FileTextOutlined />,
        name: '配置管理',
        element: lazy(async () => await import('@/pages/config'))
      }
    ]
  },
  {
    path: '/login',
    hideInMenu: true,
    element: lazy(async () => await import('@/pages/login'))
  }
]
