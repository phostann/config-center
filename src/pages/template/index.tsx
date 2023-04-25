import {
  CreateTemplateReq,
  QueryTemplateReq,
  Template,
  UpdateTemplateReq,
  useCreateTemplateMutation,
  useDeleteTemplateMutation,
  useTemplatesQuery,
  useUpdateTemplateMutation
} from '@/app/services/template'
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Space } from 'antd'
import React, { FC, useState } from 'react'
import { useForm } from 'antd/es/form/Form'
import Table, { ColumnProps } from 'antd/es/table'

const Templates: FC = () => {
  const [form] = useForm<UpdateTemplateReq>()

  const [params, setParams] = useState<QueryTemplateReq>({})
  const { data: templateRes, isLoading } = useTemplatesQuery(params)

  const [createTemplate] = useCreateTemplateMutation()
  const [updateTemplate] = useUpdateTemplateMutation()
  const [deleteTemplate] = useDeleteTemplateMutation()

  const [open, setOpen] = useState(false)

  const onQuery = (values: QueryTemplateReq): void => {
    setParams(values)
  }

  const onReset = (): void => {
    setParams({})
  }

  const onAddTemplate = (): void => {
    setOpen(true)
  }

  const onOk = (): void => {
    void (async () => {
      try {
        const values = await form.validateFields()
        if (values.id == null) {
          await createTemplate(values as CreateTemplateReq)
        } else {
          await updateTemplate(values)
        }
        setOpen(false)
        form.resetFields()
      } catch (e) {
        console.log(e)
      }
    })()
  }

  const onCancel = (): void => {
    setOpen(false)
    form.resetFields()
  }

  const onEdit = (record: Template): void => {
    form.setFieldsValue(record)
    setOpen(true)
  }

  const onDelete = (record: Template): void => {
    void (async () => {
      try {
        await deleteTemplate(record.id)
      } catch (e) {
        console.log(e)
      }
    })()
  }

  const columns: Array<ColumnProps<Template>> = [
    {
      title: '模板名称',
      dataIndex: 'name'
    },
    {
      title: '简介',
      dataIndex: 'brief'
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (_, record) => {
        return (
          <Space>
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>
            <Popconfirm title="确定要删除吗?" onConfirm={() => onDelete(record)}>
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  return (
    <>
      <div className="h-20 p-6 box-border flex items-center bg-white">
        <Form layout="inline" onFinish={onQuery} onReset={onReset}>
          <Form.Item label="模板名称" name="name">
            <Input />
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
            <Button type="primary" icon={<PlusOutlined></PlusOutlined>} onClick={onAddTemplate}>
              新增
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="mt-5">
        <Table
          rowKey={'id'}
          columns={columns}
          dataSource={templateRes?.data?.content}
          loading={isLoading}
        ></Table>
      </div>
      <Modal open={open} title="编辑模板" onOk={onOk} onCancel={onCancel}>
        <Form form={form} labelCol={{ span: 4 }}>
          <Form.Item name="id" hidden>
            <InputNumber></InputNumber>
          </Form.Item>
          <Form.Item label="模板名称" name={'name'} rules={[{ required: true }]}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="简介" name={'brief'} rules={[{ required: true }]}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="仓库地址" name={'repo'} rules={[{ required: true }]}>
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Templates
