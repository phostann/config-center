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
    element: lazy(async () => await import('@/layout/base')),
    errElement: lazy(async () => await import('@/pages/error')),
    children: [
      {
        path: '/home',
        name: '首页1',
        hideInMenu: true,
        element: lazy(async () => await import('@/pages/home'))
      },
      {
        path: '/configs',
        icon: <FileTextOutlined></FileTextOutlined>,
        name: '配置管理',
        redirect: '/configs/group',
        children: [
          {
            path: '/configs/group',
            icon: <FileTextOutlined></FileTextOutlined>,
            name: '分组管理',
            element: lazy(async () => await import('@/pages/group'))
          },
          {
            path: '/configs/config',
            icon: <FileTextOutlined />,
            name: '配置管理',
            element: lazy(async () => await import('@/pages/config')),
            children: [
              {
                path: '/configs/config/:id',
                hideInMenu: true,
                name: '详情',
                element: lazy(async () => await import('@/pages/config/detail'))
              }
            ]
          }
        ]
      },
      {
        path: '/templates',
        name: '模板管理',
        icon: <FileTextOutlined />,
        element: lazy(async () => await import('@/pages/template'))
      },
      {
        path: '/project',
        name: '项目管理',
        icon: <FileTextOutlined></FileTextOutlined>,
        element: lazy(async () => await import('@/pages/project'))
      }
    ]
  },
  {
    path: '/login',
    hideInMenu: true,
    element: lazy(async () => await import('@/pages/login'))
  }
]
