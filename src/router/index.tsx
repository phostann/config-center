import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LazyLoad } from '../utils/lazyload'

const BaseLayout = LazyLoad(React.lazy(async () => await import('@/layout/base')))

const ErrPage = LazyLoad(React.lazy(async () => await import('@/pages/error')))

const Login = LazyLoad(React.lazy(async () => await import('@/pages/login')))

const Home = LazyLoad(React.lazy(async () => await import('@/pages/home')))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={'/home'}></Navigate>,
    errorElement: ErrPage
  },
  {
    path: '/login',
    element: Login
  },
  {
    path: '/',
    element: BaseLayout,
    children: [
      {
        path: 'home',
        element: Home
      }
    ]
  }
])
