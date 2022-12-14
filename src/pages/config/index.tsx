import React, { FC, useMemo } from 'react'
import { useGetConfigQuery } from '@/app/services/config'
import { Table } from 'antd'

const Configs: FC = () => {
  const { data, isLoading } = useGetConfigQuery()

  console.log(data)

  const columns = useMemo(() => {
    return []
  }, [])

  return (
    <div className="p-6">
      <Table columns={columns} loading={isLoading}></Table>
    </div>
  )
}
export default Configs
