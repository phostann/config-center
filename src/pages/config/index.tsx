import React, { FC, useMemo, useState } from 'react'
import { Config, QueryConfigReq, useGetConfigQuery } from '@/app/services/config'
import { Button, Table, Form, Select } from 'antd'
import { ColumnType } from 'antd/es/table'
import { useGroupsQuery } from '@/app/services/group'
import { useNavigate } from 'react-router-dom'

const Configs: FC = () => {
  const [params, setParams] = useState<QueryConfigReq>({})

  const { data: configData, isLoading } = useGetConfigQuery(params)
  const { data: groups } = useGroupsQuery()
  const navigate = useNavigate()

  const columns = useMemo<Array<ColumnType<Config>>>(() => {
    return [
      {
        title: '名称',
        dataIndex: 'name'
      },
      {
        title: '分组',
        dataIndex: 'group_id',
        render: (groupId) => {
          return groups?.data?.content?.find((group) => group.id === Number(groupId))?.name
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (_, record) => {
          return (
            <Button.Group>
              <Button type="link">删除</Button>
              <Button type="link">编辑</Button>
              <Button type="link" onClick={() => onDetail(record)}>
                详情
              </Button>
            </Button.Group>
          )
        }
      }
    ]
  }, [])

  const onDetail = (config: Config): void => {
    console.log(config)
    navigate(`./${config.id}`)
  }

  const onFinish = (values: QueryConfigReq): void => {
    setParams(values)
  }

  return (
    <>
      <div className="p-6 bg-white">
        <Form<QueryConfigReq> layout={'inline'} onFinish={onFinish}>
          <Form.Item label="分组" name={'group_id'}>
            <Select className="min-w-[8rem]">
              {groups?.data?.content?.map((group) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="mt-5">
        <Table
          rowKey={'id'}
          columns={columns}
          dataSource={configData?.data?.content ?? []}
          loading={isLoading}
        ></Table>
      </div>
    </>
  )
}
export default Configs
