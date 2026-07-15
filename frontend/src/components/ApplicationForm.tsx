import { useState } from 'react'
import { Form, Input, Select, DatePicker, Button, Space } from 'antd'
import dayjs from 'dayjs'
import type { Application, CreateApplicationPayload, UpdateApplicationPayload } from '../types/application'

const STATUS_OPTIONS = [
  { label: 'Applied', value: 'applied' },
  { label: 'Interviewing', value: 'interviewing' },
  { label: 'Offer', value: 'offer' },
  { label: 'Rejected', value: 'rejected' },
]

interface Props {
  initial?: Application
  onSave: (data: CreateApplicationPayload | UpdateApplicationPayload) => Promise<void>
  onCancel: () => void
}

export function ApplicationForm({ initial, onSave, onCancel }: Props) {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(values: Record<string, unknown>) {
    setSaving(true)
    try {
      const payload = {
        ...values,
        appliedAt: (values.appliedAt as dayjs.Dayjs).format('YYYY-MM-DD'),
      }
      await onSave(payload as CreateApplicationPayload & UpdateApplicationPayload)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initial ? { ...initial, appliedAt: dayjs(initial.appliedAt) } : { status: 'applied' }}
      onFinish={handleSubmit}
    >
      <Form.Item name="company" label="Company" rules={[{ required: true, message: 'Company is required' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Role is required' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="status" label="Status">
        <Select options={STATUS_OPTIONS} />
      </Form.Item>
      <Form.Item name="appliedAt" label="Applied date" rules={[{ required: true, message: 'Date is required' }]}>
        <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={saving}>Save</Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
