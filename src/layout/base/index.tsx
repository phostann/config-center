import React, { FC, useEffect, useState } from 'react'
import { IRoute, routes } from '@/routes'
import { Menu } from 'antd'
import { ItemType } from 'antd/es/menu/hooks/useItems'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '@/components/header/header'
import Auth from '@/components/auth'

const BaseLayout: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [menuTree, setMenuTree] = useState<Map<string, string[]>>(new Map())
  const [openKeys, setOpenKeys] = useState<string[]>([])

  const onSelectedItems = ({ key, selectedKeys }: any): void => {
    navigate(key)
    setSelectedKeys(selectedKeys)
  }

  const onOpenKeyChange = (keys: string[]): void => setOpenKeys(keys)

  useEffect(() => {
    let pathname = location.pathname

    let keys
    while (pathname.length !== 0) {
      keys = menuTree.get(pathname)
      if (keys != null) {
        break
      }
      pathname = pathname.substring(0, pathname.lastIndexOf('/'))
    }

    if (keys != null) {
      setSelectedKeys(keys)
      setOpenKeys(keys)
    } else {
      setSelectedKeys([])
      setOpenKeys([])
    }
  }, [location.pathname, menuTree])

  useEffect(() => {
    setMenuTree(genMenuTree(routes))
  }, [])

  return (
    <Auth>
      <div className="w-full h-full overflow-hidden">
        <Header></Header>
        <div className="flex box-border pt-12 w-full h-full">
          <div className="w-52 h-full">
            <Menu
              items={renderSideMenus(routes)}
              mode="inline"
              selectedKeys={selectedKeys}
              openKeys={openKeys}
              onSelect={onSelectedItems}
              onOpenChange={onOpenKeyChange}
            ></Menu>
          </div>
          <div className="flex-1 bg-main-gray">
            <div className="m-6">
              <div>
                <Outlet></Outlet>
              </div>
              {/* <footer>页脚</footer> */}
            </div>
          </div>
        </div>
      </div>
    </Auth>
  )
}

export default BaseLayout

const renderSideMenus = (routes: IRoute[]): ItemType[] => {
  const items: ItemType[] = []
  routes
    .filter((route) => route.hideInMenu == null || !route.hideInMenu)
    .forEach((route) => {
      if (!(route.hideInMenu != null && route.hideInMenu)) {
        const item: ItemType = {
          label: route.name,
          key: route.path,
          icon: route.icon
        }
        items.push(item)
        if (route.children != null && route.children.length > 0) {
          const children = renderSideMenus(route.children)
          if (children.length > 0) {
            // @ts-expect-error
            item.children = children
          }
        }
      }
    })
  return items
}

const genMenuTree = (routes: IRoute[]): Map<string, string[]> => {
  const traversed = traverse(routes)
  const flated = flatRoutes(traversed)
  const treeMap = new Map<string, string[]>()
  flated.forEach((route) => {
    // exclude hidden routes
    if (route.hideInMenu != null && route.hideInMenu) return
    const keys = [route.path]
    let parent = route.parent
    while (parent != null) {
      keys.push(parent.path)
      parent = parent.parent
    }
    treeMap.set(route.path, keys)
  })

  return treeMap
}

type IRouteWithParent = IRoute & { parent?: IRouteWithParent }

const traverse = (routes: IRouteWithParent[], parent?: IRouteWithParent): IRouteWithParent[] => {
  return routes.map((route) => {
    const copy = { ...route }
    copy.parent = parent
    if (copy.children != null && copy.children.length > 0) {
      copy.children = traverse(copy.children, copy)
    }
    return copy
  })
}

const flatRoutes = (routes: IRouteWithParent[]): IRouteWithParent[] => {
  const list: IRouteWithParent[] = []
  routes.forEach((route) => {
    list.push(route)
    if (route.children != null && route.children.length > 0) {
      list.push(...flatRoutes(route.children))
    }
  })
  return list
}
