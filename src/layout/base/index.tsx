import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'

const BaseLayout: FC = () => {
  return (
    <div className="w-full h-full">
      <div></div>
      <div>
        <Outlet></Outlet>
      </div>
    </div>
  )
}

export default BaseLayout
