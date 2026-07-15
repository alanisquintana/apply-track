import { useState, useEffect, useCallback } from 'react'
import { Table, Button, Tag, Dropdown, Space, Modal, FloatButton, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, DownOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { ApplicationForm } from '../components/ApplicationForm'
import * as api from '../services/applications'
import type { Application, CreateApplicationPayload, UpdateApplicationPayload } from '../types/application'
import dayjs from 'dayjs'

const STATUS_COLORS: Record<string, string> = {
  applied: 'default',
  interviewing: 'processing',
  offer: 'success',
  rejected: 'error',
}

const STATUS_LABELS: Record<string, string> = {
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
}

const STATUS_OPTIONS = [
  { label: 'Applied', value: 'applied' },
  { label: 'Interviewing', value: 'interviewing' },
  { label: 'Offer', value: 'offer' },
  { label: 'Rejected', value: 'rejected' },
]

function formatDate(date: string) {
  return dayjs(date).format('DD/MM/YYYY')
}

export function ApplicationsList() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Application | null>(null)
  const [creating, setCreating] = useState(false)


  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getAll()
      setApps(data)
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  async function handleCreate(data: CreateApplicationPayload | UpdateApplicationPayload) {
    try {
      await api.create(data as CreateApplicationPayload)
      setCreating(false)
      message.success('Application created')
      fetchAll()
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Failed to create application')
    }
  }

  async function handleUpdate(data: UpdateApplicationPayload) {
    if (!editing) return
    try {
      await api.update(editing.id, data)
      setEditing(null)
      message.success('Application updated')
      fetchAll()
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Failed to update application')
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.remove(id)
      message.success('Application deleted')
      fetchAll()
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Failed to delete application')
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      await api.update(id, { status: newStatus as Application['status'] })
      fetchAll()
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Failed to update status')
    }
  }

  function showDeleteConfirm(id: string) {
    Modal.confirm({
      title: 'Delete application?',
      content: 'This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => handleDelete(id),
    })
  }

  const columns: ColumnsType<Application> = [
    { title: 'Company', dataIndex: 'company', key: 'company' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Application) => (
        <Dropdown
          menu={{
            items: STATUS_OPTIONS.map((opt) => ({
              key: opt.value,
              label: opt.label,
              onClick: () => handleStatusChange(record.id, opt.value),
            })),
          }}
          trigger={['click']}
        >
          <Tag
            color={STATUS_COLORS[status] ?? 'default'}
            style={{ cursor: 'pointer' }}
          >
            {STATUS_LABELS[status] ?? status} <DownOutlined />
          </Tag>
        </Dropdown>
      ),
    },
    {
      title: 'Applied',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => setEditing(record)}>
            Edit
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>ApplyTrack</h1>
        <p style={{ margin: '0.25rem 0 0', color: '#6b7280' }}>Keep track of every job you've applied to.</p>
      </header>

      <FloatButton
        type="primary"
        icon={<PlusOutlined style={{ fontSize: 24 }} />}
        onClick={() => setCreating(true)}
        style={{ width: 60, height: 60, insetInlineEnd: 24, insetBlockEnd: 24 }}
      />

      {creating && (
        <section className="form-section">
          <h2>New Application</h2>
          <ApplicationForm onSave={handleCreate} onCancel={() => setCreating(false)} />
        </section>
      )}

      {editing && (
        <section className="form-section">
          <h2>Edit Application</h2>
          <ApplicationForm initial={editing} onSave={handleUpdate} onCancel={() => setEditing(null)} />
        </section>
      )}

      <Table
        columns={columns}
        dataSource={apps}
        rowKey="id"
        loading={loading}
        pagination={false}
        locale={{ emptyText: 'No applications yet. Add your first one!' }}
      />
    </div>
  )
}
