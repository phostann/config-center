import {
  Group,
  QueryGroupReq,
  UpdateGroupReq,
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useGroupsQuery,
  useUpdateGroupMutation
} from '@/app/services/group'
import { ArrowLeftOutlined, PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, message, Modal, Popconfirm, Space } from 'antd'
import { useForm } from 'antd/es/form/Form'
import Table, { ColumnProps } from 'antd/es/table'
import React, { FC, useState } from 'react'

const Groups: FC = () => {
  const [form] = useForm<UpdateGroupReq>()
  const [params, setParams] = useState<QueryGroupReq>({})

  const { data: groupRes, isLoading } = useGroupsQuery(params)
  const [createGroup] = useCreateGroupMutation()
  const [updateGroup] = useUpdateGroupMutation()
  const [deleteGroup] = useDeleteGroupMutation()

  const [open, setOpen] = useState(false)

  const onQuery = (values: QueryGroupReq): void => {
    setParams(values)
  }

  const onReset = (): void => {
    setParams({})
  }

  const onEdit = (record: Group): void => {
    form.setFieldsValue({ ...record })
    setOpen(true)
  }

  const onDelete = (record: Group): void => {
    void (async () => {
      try {
        await deleteGroup(record.id)
      } catch (e) {
        await message.error(e as string)
      }
    })()
  }

  const columns: Array<ColumnProps<Group>> = [
    {
      title: '分组名称',
      dataIndex: 'name'
    },
    {
      title: '操作',
      dataIndex: 'action',
      render(_, record, index) {
        return (
          <Space>
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>
            <Popconfirm title="确定要删除吗?" onConfirm={() => onDelete(record)}>
              <Button type="link">删除</Button>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  const onFinish = (): void => {
    void (async () => {
      try {
        const values = await form.validateFields()
        if (values.id == null) {
          await createGroup(values)
        } else {
          await updateGroup(values)
        }
        setOpen(false)
        form.resetFields()
      } catch (error) {
        await message.error(error as string)
      }
    })()
  }
  const onCancel = (): void => {
    setOpen(false)
    form.resetFields()
  }

  const onAddGroup = (): void => {
    setOpen(true)
  }

  return (
    <>
      <div className={'h-20 p-6 box-border flex items-center bg-white'}>
        <Form<QueryGroupReq> layout="inline" onFinish={onQuery} onReset={onReset}>
          <Form.Item label="分组名称" name={'name'}>
            <Input></Input>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined></SearchOutlined>}>
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="reset" icon={<RedoOutlined></RedoOutlined>}>
              重置
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<PlusOutlined></PlusOutlined>} onClick={onAddGroup}>
              新增
            </Button>
          </Form.Item>
        </Form>
        <ArrowLeftOutlined className="ml-auto text-xl"></ArrowLeftOutlined>
      </div>
      <div className="mt-5">
        <Table
          columns={columns}
          dataSource={groupRes?.data?.content}
          loading={isLoading}
          rowKey={'id'}
        ></Table>
      </div>
      <Modal title="编辑分组" open={open} onOk={onFinish} onCancel={onCancel} maskClosable={false}>
        <Form labelCol={{ span: 4 }} form={form}>
          <Form.Item name={'id'} hidden>
            <InputNumber></InputNumber>
          </Form.Item>
          <Form.Item label="分组名称" name={'name'} rules={[{ required: true }]}>
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default Groups
