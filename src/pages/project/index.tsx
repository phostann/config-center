import React, { FC, useMemo, useState } from 'react'
import {
  AddProjectReq,
  Project as ProjectType,
  QueryProjectReq,
  UpdateProjectReq,
  useAddProjectMutation,
  useDeleteProjectMutation,
  useProjectsQuery,
  useUpdateProjectMutation
} from '@/app/services/project'
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, InputNumber, message, Modal, Popconfirm, Space } from 'antd'
import Table, { ColumnProps } from 'antd/es/table'
import { useForm } from 'antd/es/form/Form'

const Project: FC = () => {
  const [form] = useForm<AddProjectReq & { id?: number }>()

  const [params, setParams] = useState<QueryProjectReq>({ page: 1, page_size: 10 })

  const { data: projectRes } = useProjectsQuery(params)
  const [deleteProject] = useDeleteProjectMutation()
  const [open, setOpen] = useState(false)
  const [update] = useUpdateProjectMutation()
  const [add] = useAddProjectMutation()

  const onResetQuery = (): void => {
    setParams((prev) => ({ page: prev.page, page_size: prev.page_size }))
  }

  const onQuery = (values: QueryProjectReq): void => {
    setParams(values)
  }

  const onCancel = (): void => {
    setOpen(false)
    form.resetFields()
  }

  const onOk = (): void => {
    void form
      .validateFields()
      .then((values) => {
        if (values.id != null) {
          // 修改
          update(values as UpdateProjectReq)
            .then(() => {
              void message.success('修改成功')
              setOpen(false)
              form.resetFields()
            })
            .catch((e) => {
              console.log(e)
            })
        } else {
          // 新增
          add(values as AddProjectReq)
            .then(() => {
              void message.success('新增成功')
              setOpen(false)
              form.resetFields()
            })
            .catch((e) => {
              console.log(e)
            })
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const onEdit = (record: ProjectType): void => {
    form.setFieldsValue(record)
    setOpen(true)
  }

  const data = useMemo<ProjectType[]>(() => {
    if (projectRes != null) {
      return projectRes.data.content
    }
    return []
  }, [projectRes])

  const onDelete = (record: ProjectType): void => {
    void (async () => {
      try {
        await deleteProject(record.id)
      } catch (e) {
        console.error(e)
      }
    })()
  }

  const columns: Array<ColumnProps<ProjectType>> = [
    {
      title: '项目名称',
      dataIndex: 'name'
    },
    {
      title: '项目描述',
      dataIndex: 'description'
    },
    {
      title: '创建人',
      dataIndex: 'username'
    },
    {
      title: '操作',
      render: (record) => {
        return (
          <Space>
            <Button type="link">构建</Button>
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

  const onPageChange = (page: number, pageSize: number): void => {
    setParams({ ...params, page, page_size: pageSize })
  }

  const onAddProject = (): void => {
    setOpen(true)
  }

  return (
    <>
      <div className="h-20 p-6 box-border flex items-center bg-white">
        <Form<QueryProjectReq> layout="inline" onReset={onResetQuery} onFinish={onQuery}>
          <Form.Item name={'name'} label="名称">
            <Input></Input>
          </Form.Item>
          <Form.Item name={'description'} label="描述">
            <Input></Input>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" icon={<SearchOutlined></SearchOutlined>}>
              查询
            </Button>
          </Form.Item>
          <Form.Item>
            <Button htmlType="reset" type="primary" icon={<RedoOutlined></RedoOutlined>}>
              重置
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<PlusOutlined></PlusOutlined>} onClick={onAddProject}>
              新增
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="mt-5">
        <Table
          rowKey={'id'}
          columns={columns}
          dataSource={data}
          pagination={{
            current: params.page,
            pageSize: params.page_size,
            total: projectRes?.data.total ?? 0,
            showTotal: (total) => `共 ${total} 条`,
            onChange: onPageChange
          }}
        ></Table>
      </div>
      <Modal title="编辑项目" open={open} onCancel={onCancel} onOk={onOk}>
        <Form form={form} layout="horizontal" labelCol={{ span: 4 }}>
          <Form.Item name={'id'} hidden>
            <InputNumber></InputNumber>
          </Form.Item>
          <Form.Item name={'name'} label="项目名称" rules={[{ required: true }]}>
            <Input></Input>
          </Form.Item>
          <Form.Item name={'repo'} label="仓库地址" rules={[{ required: true }]}>
            <Input></Input>
          </Form.Item>
          <Form.Item name={'repo_id'} label="仓库 id" rules={[{ required: true }]}>
            <InputNumber></InputNumber>
          </Form.Item>
          <Form.Item name={'description'} label="项目描述" rules={[{ required: true }]}>
            <Input></Input>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
export default Project
