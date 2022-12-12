import React from 'react'

export const LazyLoad = (Component: React.ComponentType): React.ReactElement => {
  return <React.Suspense fallback={<>...</>}>{<Component />}</React.Suspense>
}
