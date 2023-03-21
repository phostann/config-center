import React, { FC, useMemo, useState } from 'react'
import {
  Config,
  CreateConfigReq,
  QueryConfigReq,
  UpdateConfigReq,
  useConfigsQuery,
  useCreateConfigMutation,
  useDeleteConfigMutation,
  useUpdateConfigMutation
} from '@/app/services/config'
import {
  Button,
  Table,
  Form,
  Select,
  Popconfirm,
  Modal,
  Input,
  message,
  InputNumber,
  Space
} from 'antd'
import { ColumnType } from 'antd/es/table'
import { useGroupsQuery } from '@/app/services/group'
import { useNavigate } from 'react-router-dom'
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons'
import { useForm } from 'antd/es/form/Form'

const Configs: FC = () => {
  const navigate = useNavigate()

  const [form] = useForm<CreateConfigReq & { id?: number }>()

  const [params, setParams] = useState<QueryConfigReq>({})

  const { data: configResp, isLoading } = useConfigsQuery(params)
  const { data: groupResp } = useGroupsQuery({})
  const [deleteConfig] = useDeleteConfigMutation()

  const [open, setOpen] = useState(false)

  const [create] = useCreateConfigMutation()
  const [update] = useUpdateConfigMutation()

  const columns = useMemo<Array<ColumnType<Config>>>(() => {
    return [
      {
        title: '配置名称',
        dataIndex: 'name'
      },
      {
        title: '分组名称',
        dataIndex: 'group_id',
        render: (groupId) => {
          return groupResp?.data?.content?.find((group) => group.id === groupId)?.name
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (_, record) => {
          return (
            <Space>
              <Button type="link" onClick={() => onDetail(record)}>
                详情
              </Button>
              <Button type="link" onClick={() => onEdit(record)}>
                编辑
              </Button>
              <Popconfirm title="确定要删除吗？" onConfirm={() => onDelete(record)}>
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </Space>
          )
        }
      }
    ]
  }, [groupResp])

  const onDetail = (config: Config): void => {
    navigate(`./${config.id}`)
  }

  const onEdit = (record: Config): void => {
    form.setFieldsValue({ ...record })
    setOpen(true)
  }

  const onDelete = (record: Config): void => {
    void (async () => {
      try {
        await deleteConfig(record.id)
      } catch (e: unknown) {
        await message.error(e as string)
      }
    })()
  }

  const onQuery = (values: QueryConfigReq): void => {
    setParams(values)
  }

  const onReset = (): void => {
    setParams({})
  }

  const onAddConfig = (): void => {
    setOpen(true)
  }

  const onFinish = (): void => {
    void (async () => {
      try {
        const values = await form.validateFields()
        if (values.id != null) {
          await update(values as UpdateConfigReq)
        } else {
          await create(values)
        }
        setOpen(false)
        form.resetFields()
      } catch (e: unknown) {
        await message.error(e as string)
      }
    })()
  }

  const onClose = (): void => {
    setOpen(false)
    form.resetFields()
  }

  return (
    <>
      <div className="h-20 p-6 box-border flex items-center bg-white">
        <Form<QueryConfigReq> layout={'inline'} onFinish={onQuery} onReset={onReset}>
          <Form.Item label="分组名称" name={'group_id'} className="w-52">
            <Select>
              {groupResp?.data?.content?.map((group) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="配置名称" name={'name'}>
            <Input></Input>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined></SearchOutlined>}>
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="reset" icon={<RedoOutlined />}>
              重置
            </Button>
          </Form.Item>
          <Button
            type="primary"
            className="ml-auto"
            icon={<PlusOutlined></PlusOutlined>}
            onClick={onAddConfig}
          >
            新增
          </Button>
        </Form>
      </div>
      <div className="mt-5">
        <Table
          rowKey={'id'}
          columns={columns}
          dataSource={configResp?.data?.content ?? []}
          loading={isLoading}
        ></Table>
      </div>
      <Modal open={open} title={'编辑配置'} onOk={onFinish} onCancel={onClose} maskClosable={false}>
        <Form labelCol={{ span: 4 }} form={form}>
          <Form.Item name={'id'} hidden>
            <InputNumber></InputNumber>
          </Form.Item>
          <Form.Item label="配置名称" name={'name'} rules={[{ required: true }]}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="分组" name={'group_id'} rules={[{ required: true }]}>
            <Select>
              {groupResp?.data?.content?.map((group) => (
                <Select.Option value={group.id} key={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default Configs
