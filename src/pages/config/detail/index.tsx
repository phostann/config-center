import React, { FC, useCallback, useMemo, useState } from 'react'
import {
  ConfigValue,
  ConfigValueType,
  useGetConfigQuery,
  useUpdateConfigMutation
} from '@/app/services/config'
import { Button, Form, Input, Modal, Popconfirm, Select, SelectProps, Table } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'

import type { ColumnProps } from 'antd/es/table'
import ValueItem from './components/valueItem'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import { Rule } from 'antd/es/form'
import { Media } from '@/utils/media'

const ConfigDetail: FC = () => {
  const [form] = Form.useForm<ConfigValue>()
  const navigate = useNavigate()

  const { id } = useParams()

  const { data: configRes, isLoading } = useGetConfigQuery(id ?? '')
  // updateConfigMutation
  const [update] = useUpdateConfigMutation()
  // open identify if is creating value item
  const [open, setOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number>()
  const [editingType, setEditingType] = useState<ConfigValueType>()

  const onEdit = useCallback(
    (record: ConfigValue, index: number): void => {
      setEditingIndex(index)
      setEditingType(record.type)
      form.setFieldsValue({ ...record })
    },
    [setEditingIndex]
  )

  const onDeleteConfirm = useCallback(
    (index: number) => {
      void (async () => {
        const values = [...(configRes?.data?.values ?? [])]
        values.splice(index, 1)
        await update({ id: Number(id), values })
      })()
    },
    [id, update]
  )

  const columns: Array<ColumnProps<ConfigValue>> = useMemo(
    () => [
      {
        title: '字段',
        dataIndex: 'key'
      },
      {
        title: '类型',
        dataIndex: 'type',
        render: (_, record) => {
          switch (record.type) {
            case ConfigValueType.STRING:
              return '文字'
            case ConfigValueType.NUMBER:
              return '数值'
            case ConfigValueType.BOOLEAN:
              return '布尔'
            case ConfigValueType.IMAGE:
              return '图片'
            case ConfigValueType.VIDEO:
              return '视频'
            default:
              return '未知'
          }
        }
      },
      {
        title: '值',
        dataIndex: 'value',
        render: (_, record) => {
          switch (record.type) {
            case ConfigValueType.STRING:
            case ConfigValueType.NUMBER:
            case ConfigValueType.BOOLEAN:
              return String(record.value)
            case ConfigValueType.IMAGE:
              return (
                <div className="w-8 h-8 rounded-full overflow-hidden flex justify-center items-center">
                  <img src={record.value as string} className="block max-w-full" />
                </div>
              )
            case ConfigValueType.VIDEO:
              return <video className="w-8 h-8 rounded-full" src={record.value as string} />
            default:
              return record.value
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (_, record, index) => {
          return (
            <Button.Group>
              <Button type="link" onClick={() => onEdit(record, index)}>
                编辑
              </Button>
              <Popconfirm title="确定要删除吗?" onConfirm={() => onDeleteConfirm(index)}>
                <Button type="link">删除</Button>
              </Popconfirm>
            </Button.Group>
          )
        }
      }
    ],
    [onEdit, onDeleteConfirm]
  )

  const formItemType = useMemo(() => {
    switch (editingType) {
      case ConfigValueType.STRING:
        return 'string'
      case ConfigValueType.NUMBER:
        return 'number'
      case ConfigValueType.BOOLEAN:
        return 'boolean'
      case ConfigValueType.IMAGE:
      case ConfigValueType.VIDEO:
        return 'string'
      default:
        return undefined
    }
  }, [editingType])

  const formItemErrorMsg = useMemo(() => {
    switch (editingType) {
      case ConfigValueType.STRING:
        return '请输入文字'
      case ConfigValueType.NUMBER:
        return '请输入数值'
      case ConfigValueType.BOOLEAN:
        return '请选择布尔值'
      case ConfigValueType.IMAGE:
        return '请上传图片'
      case ConfigValueType.VIDEO:
        return '请上传视频'
    }
  }, [editingType])

  const onSave = (): void => {
    void (async (): Promise<void> => {
      try {
        const payload = await form.validateFields()
        const values = [...(configRes?.data.values ?? [])]
        if (open) {
          // create
          values.push(payload)
        } else {
          // update
          values.splice(editingIndex ?? -1, 1, payload)
        }

        id != null && (await update({ id: Number(id), values }))
        setEditingIndex(undefined)
        setOpen(false)
        form.resetFields()
      } catch (error) {
        console.log(error)
      }
    })()
  }

  const onClose = (): void => {
    setEditingIndex(undefined)
    setOpen(false)
    form.resetFields()
  }

  const onTypeChange: SelectProps['onChange'] = (e) => {
    setEditingType(e as ConfigValueType)
  }

  const onAddConfigValueItem = useCallback(() => {
    setOpen(true)
  }, [])

  const validator = async (rule: Rule, value: string): Promise<void> => {
    if (editingType === ConfigValueType.IMAGE) {
      return Media.checkIsImg(value)
        ? await Promise.resolve()
        : await Promise.reject(new Error('请上传图片'))
    } else if (editingType === ConfigValueType.VIDEO) {
      return Media.checkIsVideo(value)
        ? await Promise.resolve()
        : await Promise.reject(new Error('请上传图片'))
    }
    return await Promise.resolve()
  }

  const goBack = (): void => {
    navigate(-1)
  }

  return (
    <React.Fragment>
      <div className="w-full h-20 bg-white mb-4 flex items-center box-border p-6 font-bold">
        <div className="mr-4">{configRes?.data.name ?? ''}</div>
        <Button type="primary" icon={<PlusOutlined></PlusOutlined>} onClick={onAddConfigValueItem}>
          新增
        </Button>
        <ArrowLeftOutlined
          className="ml-auto cursor-pointer text-xl"
          onClick={goBack}
        ></ArrowLeftOutlined>
      </div>
      <Table
        columns={columns}
        loading={isLoading}
        dataSource={configRes?.data.values}
        rowKey="key"
        pagination={false}
      ></Table>
      <Modal
        open={open || editingIndex != null}
        title="编辑配置"
        closable={true}
        onOk={onSave}
        onCancel={onClose}
      >
        <Form<ConfigValue> form={form} labelCol={{ span: 4 }}>
          <Form.Item label="字段名称" name={'key'} rules={[{ required: true }]}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="字段类型" name={'type'} rules={[{ required: true }]}>
            <Select onChange={onTypeChange}>
              <Select.Option value={ConfigValueType.STRING}>文字</Select.Option>
              <Select.Option value={ConfigValueType.NUMBER}>数值</Select.Option>
              <Select.Option value={ConfigValueType.BOOLEAN}>布尔</Select.Option>
              <Select.Option value={ConfigValueType.IMAGE}>图片</Select.Option>
              <Select.Option value={ConfigValueType.VIDEO}>视频</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="字段值"
            name={'value'}
            rules={[
              {
                required: true,
                type: formItemType,
                message: formItemErrorMsg,
                validator:
                  editingType === ConfigValueType.IMAGE || editingType === ConfigValueType.VIDEO
                    ? validator
                    : undefined
              }
            ]}
          >
            <ValueItem valueType={editingType ?? ConfigValueType.STRING}></ValueItem>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  )
}

export default ConfigDetail
