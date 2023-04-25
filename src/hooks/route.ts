import { useNavigate as _useNavigate } from 'react-router-dom'
import { NavigateFunction } from 'react-router/dist/lib/hooks'

export const useBaseName = (): string => {
  return process.env.NODE_ENV === 'production' ? '/config-center/' : '/'
}

export const useNav =
  (): NavigateFunction =>
  (to): void => {
    const navigate = _useNavigate()

    if (typeof to === 'number') {
      navigate(to)
    }
  }
