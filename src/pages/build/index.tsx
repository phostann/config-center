import React, { FC } from 'react'
import { Button, Form, Input, Table } from 'antd'
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons'

const Build: FC = () => {
  const onResetQuery = (): void => {}
  const onQuery = (): void => {}

  return (
    <>
      <div className="h-20 p-6 box-border flex items-center bg-white">
        <Form layout="inline" onReset={onResetQuery} onFinish={onQuery}>
          <Form.Item name={'name'} label="名称">
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
            <Button type="primary" icon={<PlusOutlined></PlusOutlined>}>
              新增
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className={'mt-5'}>
        <Table rowKey={'id'}></Table>
      </div>
    </>
  )
}
export default Build
