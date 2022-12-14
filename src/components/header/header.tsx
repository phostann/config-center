import React, { FC } from 'react'
import { useGetProfileQuery } from '@/app/services/profile'
import { Link, useNavigate } from 'react-router-dom'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { logout } from '@/components/auth/authSlice'

const Header: FC = () => {
  const navigate = useNavigate()
  const { data } = useGetProfileQuery()

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '1') {
      // remove token from local storage
      localStorage.removeItem('auth')
      logout()
      // redirect to login page
      navigate('/login', { replace: true })
    }
  }

  return (
    <header className="w-full h-12 bg-main-black text-white flex items-center box-border px-4 fixed top-0 left-0">
      <Link to="/" className="flex text-white no-underline items-center text-lg font-semibold">
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          className="block w-7 h-7"
        ></img>
        <span className="ml-3">Ant Design Pro</span>
      </Link>
      <Dropdown
        menu={{ items: [{ key: '1', label: '退出登录', icon: <LogoutOutlined />, onClick }] }}
        trigger={['click']}
      >
        <div className="h-full flex items-center px-3 ml-auto cursor-pointer">
          {data?.data?.email ?? ''}
        </div>
      </Dropdown>
    </header>
  )
}

export default Header
