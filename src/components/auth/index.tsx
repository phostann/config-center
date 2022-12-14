import React, { FC, ReactElement } from 'react'
import { selectToken } from '@/pages/login/authSlice'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

const Auth: FC<{ children?: ReactElement }> = ({ children }) => {
  const token = useSelector(selectToken)
  const location = useLocation()
  const navigate = useNavigate()

  if (token == null && location.pathname !== '/login') {
    navigate('/login')
  }

  return <>{children}</>
}

export default Auth
