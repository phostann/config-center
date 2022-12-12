import React, { FC } from 'react'
import { Button } from 'antd'
import { useGroupsQuery } from '@/app/services/group'

const Home: FC = () => {
  const { data, error } = useGroupsQuery()
  console.log(data, error)

  return (
    <>
      <Button type="primary">中文</Button>
    </>
  )
}

export default Home
