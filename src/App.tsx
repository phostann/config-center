import React, { FC } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider
} from 'react-router-dom'
import zhCN from 'antd/locale/zh_CN'
import LazyLoad from './components/lazyComponent'
import { IRoute, routes } from './routes'
import { ConfigProvider } from 'antd'
import './App.css'

const isProd = process.env.NODE_ENV === 'production'

// const basename = isProd ? '/config-center/' : '/'
const basename = isProd ? '/' : '/'

const App: FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider
        router={createBrowserRouter(createRouteObjects(routes), {
          basename
        })}
      ></RouterProvider>
    </ConfigProvider>
  )
}

export default App

const createRouteObjects = (routes: IRoute[]): RouteObject[] => {
  const _routes: RouteObject[] = []
  routes.forEach((route) => {
    const item: RouteObject = {
      element:
        route.element != null ? (
          <LazyLoad>
            <route.element></route.element>
          </LazyLoad>
        ) : (
          <>
            <Outlet></Outlet>
          </>
        ),
      children: []
    }
    if (route.redirect == null) {
      item.path = route.path
    }
    if (route.errElement != null) {
      item.errorElement = (
        <LazyLoad>
          <route.errElement></route.errElement>
        </LazyLoad>
      )
    }
    if (route.redirect != null) {
      item.children?.push({
        path: route.path,
        element: <Navigate to={route.redirect}></Navigate>
      })
    }
    // hoist the child route
    if (route.children != null && route.children.length > 0) {
      const [nested, children] = route.children?.reduce<[IRoute[], IRoute[]]>(
        (acc, cur) => {
          if (cur.path?.match(':.+$') != null) {
            acc[0].push(cur)
          } else {
            acc[1].push(cur)
          }
          return acc
        },
        [[], []]
      ) ?? [[], []]

      _routes.push(...createRouteObjects(nested))

      item.children?.push(...createRouteObjects(children))
    }
    _routes.push(item)
  })
  return _routes
}
