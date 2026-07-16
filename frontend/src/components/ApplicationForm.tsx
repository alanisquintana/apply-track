import { useState } from 'react'
import {
  TextField, MenuItem, Button, Stack, FormControl, InputLabel, Select,
  FormHelperText,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
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

interface FormState {
  company: string
  role: string
  status: string
  appliedAt: dayjs.Dayjs | null
  description: string
  interviewDate: dayjs.Dayjs | null
  link: string
  appliedWhere: string
}

function toDayjs(val: string | null | undefined) {
  return val ? dayjs(val) : null
}

const emptyForm = (): FormState => ({
  company: '',
  role: '',
  status: 'applied',
  appliedAt: null,
  description: '',
  interviewDate: null,
  link: '',
  appliedWhere: '',
})

export function ApplicationForm({ initial, onSave, onCancel }: Props) {
  const [values, setValues] = useState<FormState>(
    initial
      ? {
          company: initial.company,
          role: initial.role,
          status: initial.status,
          appliedAt: dayjs(initial.appliedAt),
          description: initial.description ?? '',
          interviewDate: toDayjs(initial.interviewDate),
          link: initial.link ?? '',
          appliedWhere: initial.appliedWhere ?? '',
        }
      : emptyForm(),
  )
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [saving, setSaving] = useState(false)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {}
    if (!values.company.trim()) errs.company = 'Company is required'
    if (!values.role.trim()) errs.role = 'Role is required'
    if (!values.appliedAt) errs.appliedAt = 'Date is required'
    if (values.interviewDate && values.appliedAt && values.interviewDate.isBefore(values.appliedAt, 'day')) {
      errs.interviewDate = 'Interview date must be on or after the applied date'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSaving(true)
    try {
      let status = values.status
      const interviewDate = values.interviewDate?.format('YYYY-MM-DD')
      if (interviewDate && status === 'applied') {
        status = 'interviewing'
      }
      const payload = {
        company: values.company.trim(),
        role: values.role.trim(),
        status,
        appliedAt: values.appliedAt!.format('YYYY-MM-DD'),
        description: values.description.trim() || undefined,
        interviewDate,
        link: values.link.trim() || undefined,
        appliedWhere: values.appliedWhere.trim() || undefined,
      }
      await onSave(payload as CreateApplicationPayload & UpdateApplicationPayload)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      <TextField
        label="Company"
        value={values.company}
        onChange={e => set('company', e.target.value)}
        error={!!errors.company}
        helperText={errors.company}
        fullWidth
        required
      />
      <TextField
        label="Role"
        value={values.role}
        onChange={e => set('role', e.target.value)}
        error={!!errors.role}
        helperText={errors.role}
        fullWidth
        required
      />
      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select
          label="Status"
          value={values.status}
          onChange={e => set('status', e.target.value)}
        >
          {STATUS_OPTIONS.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <DatePicker
        label="Applied date"
        value={values.appliedAt}
        onChange={v => set('appliedAt', v)}
        slotProps={{
          textField: {
            fullWidth: true,
            required: true,
            error: !!errors.appliedAt,
            helperText: errors.appliedAt,
          },
        }}
      />
      <TextField
        label="Description"
        value={values.description}
        onChange={e => set('description', e.target.value)}
        fullWidth
        multiline
        rows={3}
      />
      <DatePicker
        label="Interview date"
        value={values.interviewDate}
        onChange={v => set('interviewDate', v)}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!errors.interviewDate,
            helperText: errors.interviewDate,
          },
        }}
      />
      <TextField
        label="Link"
        value={values.link}
        onChange={e => set('link', e.target.value)}
        fullWidth
        placeholder="https://"
      />
      <TextField
        label="Applied where"
        value={values.appliedWhere}
        onChange={e => set('appliedWhere', e.target.value)}
        fullWidth
        placeholder="e.g. LinkedIn, company website"
      />
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Stack>
    </Stack>
  )
}
