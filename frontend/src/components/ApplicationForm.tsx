import { useState } from 'react'
import {
  Box, TextField, MenuItem, Button, Stack, FormControl, InputLabel, Select, Typography,
} from '@mui/material'
import { useColors } from '../hooks/useColors'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import dayjs from 'dayjs'
import type { Application, CreateApplicationPayload, UpdateApplicationPayload, WorkModel } from '../types/application'

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

const WORK_MODEL_OPTIONS = [
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'On-site', value: 'on-site' },
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
  interviewTime: dayjs.Dayjs | null
  link: string
  appliedWhere: string
  logoUrl: string
  salaryMin: string
  salaryMax: string
  recruiterLink: string
  workModel: string
  interviewLink: string
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
  interviewTime: null,
  link: '',
  appliedWhere: '',
  logoUrl: '',
  salaryMin: '',
  salaryMax: '',
  recruiterLink: '',
  workModel: '',
  interviewLink: '',
})

export function ApplicationForm({ initial, onSave, onCancel }: Props) {
  const colors = useColors()
  const [values, setValues] = useState<FormState>(
    initial
      ? {
          company: initial.company,
          role: initial.role,
          status: initial.status,
          appliedAt: dayjs(initial.appliedAt),
          description: initial.description ?? '',
          interviewDate: toDayjs(initial.interviewDate),
          interviewTime: initial.interviewTime ? dayjs(initial.interviewTime, 'HH:mm') : null,
          link: initial.link ?? '',
          appliedWhere: initial.appliedWhere ?? '',
          logoUrl: initial.logoUrl ?? '',
          salaryMin: initial.salaryMin?.toString() ?? '',
          salaryMax: initial.salaryMax?.toString() ?? '',
          recruiterLink: initial.recruiterLink ?? '',
          workModel: initial.workModel ?? '',
          interviewLink: initial.interviewLink ?? '',
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
      const interviewTime = values.interviewTime?.format('HH:mm')
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
        interviewTime,
        link: values.link.trim() || undefined,
        appliedWhere: values.appliedWhere.trim() || undefined,
        logoUrl: values.logoUrl.trim() || undefined,
        salaryMin: values.salaryMin ? Number(values.salaryMin) : undefined,
        salaryMax: values.salaryMax ? Number(values.salaryMax) : undefined,
        recruiterLink: values.recruiterLink.trim() || undefined,
        workModel: (values.workModel as WorkModel) || undefined,
        interviewLink: values.interviewLink.trim() || undefined,
      }
      await onSave(payload as CreateApplicationPayload & UpdateApplicationPayload)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Stack spacing={2} sx={{ mt: 1 }}>
      <Typography variant="subtitle2" sx={{ color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Job Details
      </Typography>
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
      <FormControl fullWidth>
        <InputLabel>Work model</InputLabel>
        <Select
          label="Work model"
          value={values.workModel}
          onChange={e => set('workModel', e.target.value)}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {WORK_MODEL_OPTIONS.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction="row" spacing={2}>
        <TextField
          label="Salary min"
          value={values.salaryMin}
          onChange={e => set('salaryMin', e.target.value)}
          type="number"
          sx={{ flex: 1 }}
          placeholder="80000"
        />
        <TextField
          label="Salary max"
          value={values.salaryMax}
          onChange={e => set('salaryMax', e.target.value)}
          type="number"
          sx={{ flex: 1 }}
          placeholder="120000"
        />
      </Stack>
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
      <TextField
        label="Company logo URL"
        value={values.logoUrl}
        onChange={e => set('logoUrl', e.target.value)}
        fullWidth
        placeholder="https://example.com/logo.png"
      />

      <Typography variant="subtitle2" sx={{ color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em', mt: 1 }}>
        Interview
      </Typography>
      <Stack direction="row" spacing={2}>
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
          sx={{ flex: 1 }}
        />
        <TimePicker
          label="Interview time"
          value={values.interviewTime}
          onChange={v => set('interviewTime', v)}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{ flex: 1 }}
        />
      </Stack>
      <TextField
        label="Interview link"
        value={values.interviewLink}
        onChange={e => set('interviewLink', e.target.value)}
        fullWidth
        placeholder="https://meet.google.com/xyz"
      />

      <Typography variant="subtitle2" sx={{ color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em', mt: 1 }}>
        Recruiter
      </Typography>
      <TextField
        label="Recruiter link"
        value={values.recruiterLink}
        onChange={e => set('recruiterLink', e.target.value)}
        fullWidth
        placeholder="https://linkedin.com/in/recruiter"
      />

      <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Stack>
    </Stack>
  )
}
