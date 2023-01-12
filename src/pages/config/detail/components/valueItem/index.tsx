import { ConfigValueType } from '@/app/services/config'
import { useUploadMutation } from '@/app/services/file'
import { Media } from '@/utils/media'
import { PlusOutlined } from '@ant-design/icons'
import { Checkbox, Input, InputNumber, Upload, UploadProps } from 'antd'
import React, { FC, useEffect } from 'react'

interface ValueItemProps {
  value?: string | number | boolean
  valueType: ConfigValueType
  onChange?: (value: string | number | boolean) => void
}

const getFileName = (url: string): string => {
  const index = url.lastIndexOf('/')
  return url.substring(index + 1)
}

const ValueItem: FC<ValueItemProps> = ({ value, valueType, onChange }) => {
  const [upload, { data: uploadRes }] = useUploadMutation()

  useEffect(() => {
    if (uploadRes != null) {
      onChange?.(uploadRes.data)
    }
  }, [uploadRes, onChange])

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    void (async () => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        await upload(formData)
      } catch (error) {
        console.log(error)
      }
    })()
    return false
  }

  const onUploadChange: UploadProps['onChange'] = ({ file }) => {
    onChange?.(file.url as string)
  }

  const renderValueItem = (): React.ReactElement => {
    switch (valueType) {
      case ConfigValueType.STRING:
        return <Input value={value as string} onChange={(e) => onChange?.(e.target.value)}></Input>
      case ConfigValueType.NUMBER:
        return (
          <InputNumber
            value={value as number}
            onChange={(e) => onChange?.(e as number)}
          ></InputNumber>
        )
      case ConfigValueType.BOOLEAN:
        return (
          <Checkbox
            checked={value as boolean}
            onChange={(e) => onChange?.(e.target.checked)}
          ></Checkbox>
        )
      case ConfigValueType.IMAGE:
        return (
          <Upload
            listType={'picture-card'}
            accept={Media.imgAccept}
            fileList={
              value != null && typeof value === 'string' && Media.checkIsImg(value)
                ? [
                    {
                      uid: '-1',
                      url: value,
                      name: getFileName(value),
                      status: 'done'
                    }
                  ]
                : []
            }
            maxCount={1}
            beforeUpload={beforeUpload}
            onChange={onUploadChange}
          >
            <div>
              <PlusOutlined></PlusOutlined>
              <div className="mt-2">上传</div>
            </div>
          </Upload>
        )
      case ConfigValueType.VIDEO:
        return (
          <Upload
            listType={'picture-card'}
            accept={Media.videoAccept}
            fileList={
              value != null && typeof value === 'string' && Media.checkIsVideo(value)
                ? [
                    {
                      uid: '-1',
                      url: value,
                      name: getFileName(value),
                      status: 'done'
                    }
                  ]
                : []
            }
            maxCount={1}
            beforeUpload={beforeUpload}
            onChange={onUploadChange}
          >
            <div>
              <PlusOutlined></PlusOutlined>
              <div className="mt-2">上传</div>
            </div>
          </Upload>
        )
      default:
        return <></>
    }
  }

  return renderValueItem()
}
export default ValueItem
