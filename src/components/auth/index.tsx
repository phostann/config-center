import React, { FC, ReactElement } from 'react'
import { selectToken } from '@/components/auth/authSlice'
import { useSelector } from 'react-redux'
import { redirect, useLocation } from 'react-router-dom'

const Auth: FC<{ children?: ReactElement }> = ({ children }) => {
  const token = useSelector(selectToken)
  const location = useLocation()

  if (token == null && location.pathname !== '/login') {
    redirect('/login')
  }

  return <>{children}</>
}

export default Auth
