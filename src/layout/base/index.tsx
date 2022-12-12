import React, { FC } from 'react'
import { Outlet } from 'react-router-dom'

const BaseLayout: FC = () => {
  return (
    <div className="flex w-full h-full bg-black">
      <div>
        <Outlet></Outlet>
      </div>
      <div></div>
    </div>
  )
}

export default BaseLayout
