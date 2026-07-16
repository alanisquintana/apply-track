import { useState } from 'react'
import {
  Box, TextField, MenuItem, Button, Stack, FormControl, InputLabel, Select,
  FormHelperText,
} from '@mui/material'
import { colors } from '../theme/colors'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import dayjs from 'dayjs'
import type { Application, CreateApplicationPayload, UpdateApplicationPayload } from '../types/application'

const toolbar = [
  [{ header: ['1', '2', '3', false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ align: [] }],
  ['blockquote', 'code-block'],
  ['link'],
  ['clean'],
]

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'align', 'blockquote', 'code-block', 'link',
]

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
        description: values.description.replace(/<[^>]*>/g, '').trim() ? values.description : undefined,
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
      <Box>
        <InputLabel sx={{ mb: 0.5, fontSize: '0.8rem', color: colors.muted }}>Description</InputLabel>
        <Box
          sx={{
            '& .ql-toolbar': { borderColor: colors.divider, borderRadius: '4px 4px 0 0', bgcolor: colors.elevation },
            '& .ql-container': { borderColor: colors.divider, borderRadius: '0 0 4px 4px', bgcolor: colors.elevation, fontFamily: 'inherit', fontSize: '0.9rem' },
            '& .ql-editor': { color: colors.text, minHeight: 100 },
            '& .ql-editor.ql-blank::before': { color: colors.muted, fontStyle: 'normal' },
            '& .ql-toolbar button .ql-stroke': { stroke: colors.text },
            '& .ql-toolbar button .ql-fill': { fill: colors.text },
            '& .ql-toolbar button:hover .ql-stroke, & .ql-toolbar button.ql-active .ql-stroke': { stroke: colors.primary },
            '& .ql-toolbar button:hover .ql-fill, & .ql-toolbar button.ql-active .ql-fill': { fill: colors.primary },
            '& .ql-toolbar .ql-picker-label': { color: colors.text },
            '& .ql-toolbar .ql-picker-label:hover, & .ql-toolbar .ql-picker-label.ql-active': { color: colors.primary },
            '& .ql-toolbar .ql-picker-options': { bgcolor: colors.elevation, borderColor: colors.divider, color: colors.text },
            '& .ql-toolbar .ql-color-picker .ql-picker-options': { bgcolor: colors.elevation, borderColor: colors.divider },
            '& .ql-toolbar .ql-background-picker .ql-picker-options': { bgcolor: colors.elevation, borderColor: colors.divider },
          }}
        >
          <ReactQuill
            value={values.description}
            onChange={v => set('description', v)}
            theme="snow"
            modules={{ toolbar }}
            formats={formats}
            placeholder="Add notes, requirements, etc."
          />
        </Box>
      </Box>
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
