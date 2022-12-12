import React, { FC } from 'react'

const ErrPage: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="text-2xl font-bold text-red-500">404</div>
      <div className="text-xl font-bold text-gray-500">Page Not Found</div>
    </div>
  )
}

export default ErrPage
