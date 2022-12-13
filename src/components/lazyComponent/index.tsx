import React, { FC, Suspense, ReactElement } from 'react'
import { Spin } from 'antd'

const LazyLoad: FC<{ children?: ReactElement }> = ({ children }) => {
  return (
    <Suspense
      fallback={
        <div className="fixed w-full h-full flex justify-center items-center">
          <Spin tip="加载中"></Spin>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export default LazyLoad
