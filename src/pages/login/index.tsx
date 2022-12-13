import React, { FC } from 'react'
import { Button, Form, Input } from 'antd'
import { LoginRequest, useLoginMutation } from '../../app/services/auth'
import { useDispatch } from 'react-redux'
import { setToken } from './authSlice'

const Login: FC = () => {
  const dispatch = useDispatch()
  const [login] = useLoginMutation()

  const [form] = Form.useForm<LoginRequest>()

  const onFinish = (values: LoginRequest): void => {
    login(values)
      .then((res) => {
        try {
          // @ts-expect-error
          localStorage.setItem('auth', JSON.stringify(res.data.data))

          // @ts-expect-error
          dispatch(setToken(res.data.data))
        } catch (error) {}
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-80">
        <Form<LoginRequest> form={form} labelCol={{ span: 8 }} onFinish={onFinish}>
          <Form.Item label="邮箱" name={'email'} rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="邮箱" type={'text'} />
          </Form.Item>
          <Form.Item label="密码" required name="password">
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
