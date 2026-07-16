import { useState, useEffect, useCallback, useMemo, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, Paper, Button, IconButton, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, Snackbar, Alert, Stack,
  Badge,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { PickerDay } from '@mui/x-date-pickers/PickerDay'
import dayjs from 'dayjs'
import { colors } from '../theme/colors'
import { useRefresh } from '../hooks/useRefresh'
import { ApplicationForm } from '../components/ApplicationForm'
import * as api from '../services/applications'
import type { Application, UpdateApplicationPayload } from '../types/application'

type StatusKey = 'applied' | 'interviewing' | 'offer' | 'rejected'

const statusDotColors: Record<StatusKey, string> = {
  applied: colors.muted,
  interviewing: colors.primary,
  offer: colors.success,
  rejected: colors.danger,
}

const statusLabels: Record<StatusKey, string> = {
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

type SortKey = 'company' | 'role' | 'status' | 'appliedAt' | 'interviewDate' | 'appliedWhere'

export function ApplicationsList() {
  const navigate = useNavigate()
  const { version } = useRefresh()
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Application | null>(null)
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('appliedAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [statusMenu, setStatusMenu] = useState<{ anchor: HTMLElement; app: Application } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Application | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getAll()
      setApps(data)
    } catch (e) {
      setSnackbar({ message: e instanceof Error ? e.message : 'Failed to load applications', severity: 'error' })
    } finally {
      setLoading(false)
    }
  }, [version])

  useEffect(() => { fetchAll() }, [fetchAll])

  async function handleUpdate(data: UpdateApplicationPayload) {
    if (!editing) return
    try {
      await api.update(editing.id, data)
      setEditing(null)
      setSnackbar({ message: 'Application updated', severity: 'success' })
      fetchAll()
    } catch (e) {
      setSnackbar({ message: e instanceof Error ? e.message : 'Failed to update application', severity: 'error' })
    }
  }

  async function handleDelete(app: Application) {
    setDeleteConfirm(null)
    try {
      await api.remove(app.id)
      setSnackbar({ message: 'Application deleted', severity: 'success' })
      fetchAll()
    } catch (e) {
      setSnackbar({ message: e instanceof Error ? e.message : 'Failed to delete application', severity: 'error' })
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      await api.update(id, { status: newStatus as Application['status'] })
      setStatusMenu(null)
      fetchAll()
    } catch (e) {
      setSnackbar({ message: e instanceof Error ? e.message : 'Failed to update status', severity: 'error' })
    }
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const statusRank: Record<string, number> = { interviewing: 0, applied: 1, offer: 2, rejected: 3 }

  const sorted = useMemo(() => {
    const copy = [...apps]
    copy.sort((a, b) => {
      if (sortKey === 'appliedAt' && sortDir === 'desc') {
        const rankDiff = statusRank[a.status] - statusRank[b.status]
        if (rankDiff !== 0) return rankDiff
        const va = a.appliedAt || ''
        const vb = b.appliedAt || ''
        return vb.localeCompare(va)
      }
      let cmp = 0
      if (sortKey === 'appliedAt' || sortKey === 'interviewDate') {
        const va = a[sortKey] || ''
        const vb = b[sortKey] || ''
        cmp = va.localeCompare(vb)
      } else {
        cmp = (a[sortKey] as string).localeCompare(b[sortKey] as string)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [apps, sortKey, sortDir])

  const interviewDateMap = useMemo(() => {
    const map: Record<string, Application[]> = {}
    for (const app of apps) {
      if (app.interviewDate) {
        const key = dayjs(app.interviewDate).format('YYYY-MM-DD')
        if (!map[key]) map[key] = []
        map[key].push(app)
      }
    }
    return map
  }, [apps])

  const upcomingInterviews = useMemo(() => {
    const today = dayjs().startOf('day')
    return apps
      .filter(app => app.interviewDate && dayjs(app.interviewDate).startOf('day').diff(today, 'day') >= 0)
      .sort((a, b) => dayjs(a.interviewDate).unix() - dayjs(b.interviewDate).unix())
      .slice(0, 5)
  }, [apps])

  function SortableHead({ label, sortKey: sk }: { label: string; sortKey: SortKey }) {
    return (
      <TableSortLabel active={sortKey === sk} direction={sortKey === sk ? sortDir : 'asc'} onClick={() => handleSort(sk)} sx={{ '&.Mui-active': { color: colors.primary, '& .MuiTableSortLabel-icon': { color: colors.primary } } }}>
        {label}
      </TableSortLabel>
    )
  }

  function InterviewDay(props: any) {
    const key = props.day.format('YYYY-MM-DD')
    const hasInterview = !!interviewDateMap[key]
    return <Badge color="error" variant="dot" invisible={!hasInterview}><PickerDay {...props} /></Badge>
  }

  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text, mb: 0.5 }}>
        Home
      </Typography>
      <Typography variant="body2" sx={{ color: colors.text, mb: 2 }}>
        👋 Here you can manage all your job applications
      </Typography>
      <Box sx={{ height: '1px', bgcolor: colors.divider, mb: 3 }} />

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><SortableHead label="Company" sortKey="company" /></TableCell>
                  <TableCell><SortableHead label="Role" sortKey="role" /></TableCell>
                  <TableCell><SortableHead label="Status" sortKey="status" /></TableCell>
                  <TableCell>Link</TableCell>
                  <TableCell><SortableHead label="Applied Where" sortKey="appliedWhere" /></TableCell>
                  <TableCell><SortableHead label="Interview Date" sortKey="interviewDate" /></TableCell>
                  <TableCell><SortableHead label="Applied" sortKey="appliedAt" /></TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sorted.map((app) => (
                  <TableRow key={app.id} hover onClick={() => navigate(`/applications/${app.id}`)} sx={{ cursor: 'pointer' }}>
                    <TableCell sx={{ fontWeight: 500 }}>{app.company}</TableCell>
                    <TableCell>{app.role}</TableCell>
                    <TableCell>
                      <Box
                        onClick={(e: MouseEvent<HTMLElement>) => { e.stopPropagation(); setStatusMenu({ anchor: e.currentTarget, app }) }}
                        sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, cursor: 'pointer', py: 0.5 }}
                      >
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: statusDotColors[app.status] ?? colors.muted, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ color: colors.muted, fontSize: '0.85rem', lineHeight: 1 }}>
                          {statusLabels[app.status] ?? app.status}
                        </Typography>
                        <ArrowDropDownIcon sx={{ color: colors.muted, fontSize: 16 }} />
                      </Box>
                      <Menu
                        anchorEl={statusMenu?.anchor}
                        open={statusMenu?.app.id === app.id}
                        onClose={() => setStatusMenu(null)}
                        slotProps={{ paper: { sx: { border: `1px solid ${colors.divider}`, borderRadius: 2, minWidth: 140 } } }}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <MenuItem
                            key={opt.value}
                            selected={app.status === opt.value}
                            onClick={(e: MouseEvent) => { e.stopPropagation(); handleStatusChange(app.id, opt.value) }}
                            sx={{ fontSize: '0.85rem', gap: 1, color: colors.text, '&.Mui-selected': { backgroundColor: 'transparent' }, '&:hover': { backgroundColor: 'transparent' } }}
                          >
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: statusDotColors[opt.value], flexShrink: 0 }} />
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </TableCell>
                    <TableCell align="center" sx={{ color: colors.muted }}>
                      {app.link ? (
                        <IconButton size="small" component="a" href={app.link} target="_blank" rel="noopener noreferrer" onClick={(e: MouseEvent) => e.stopPropagation()}>
                          <LinkIcon sx={{ color: colors.muted }} fontSize="small" />
                        </IconButton>
                      ) : '-'}
                    </TableCell>
                    <TableCell sx={{ color: colors.muted }}>{app.appliedWhere ?? '-'}</TableCell>
                    <TableCell sx={{ color: colors.muted }}>{app.interviewDate ? formatDate(app.interviewDate) : '-'}</TableCell>
                    <TableCell sx={{ color: colors.muted }}>{formatDate(app.appliedAt)}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <IconButton size="small" onClick={(e: MouseEvent) => { e.stopPropagation(); setEditing(app) }}>
                          <EditIcon sx={{ color: colors.muted }} fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={(e: MouseEvent) => { e.stopPropagation(); setDeleteConfirm(app) }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ width: 300, flexShrink: 0, bgcolor: colors.elevation, borderRadius: 2, p: 2, position: 'sticky', top: 0 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.primary', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Interviews
          </Typography>
          <DateCalendar
            slots={{ day: InterviewDay }}
            readOnly
            sx={{ width: '100%', '& .MuiDayCalendar-header': { justifyContent: 'center' }, '& .MuiPickersCalendarHeader-root': { mb: 0.5 } }}
          />
          {upcomingInterviews.length > 0 && (
            <Box sx={{ mt: 0.5 }}>
              <Typography variant="caption" sx={{ color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', mb: 1, display: 'block' }}>
                Upcoming
              </Typography>
              <Stack spacing={0.5}>
                {upcomingInterviews.map(app => (
                  <Box
                    key={app.id}
                    onClick={() => navigate(`/applications/${app.id}`)}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', p: 0.5, borderRadius: 1, '&:hover': { bgcolor: colors.background } }}
                  >
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: statusDotColors[app.status] ?? colors.muted, flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ color: colors.text, fontSize: '0.78rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {app.company} - {app.role}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: colors.muted, fontSize: '0.7rem', flexShrink: 0 }}>
                      {dayjs(app.interviewDate).format('DD/MM')}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Box>

      <Dialog open={!!editing} onClose={() => setEditing(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Application</DialogTitle>
        <DialogContent>
          {editing && <ApplicationForm initial={editing} onSave={handleUpdate} onCancel={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete application?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>This action cannot be undone.</Typography>
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {snackbar && (
        <Snackbar open autoHideDuration={4000} onClose={() => setSnackbar(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)} variant="filled">{snackbar.message}</Alert>
        </Snackbar>
      )}
    </>
  )
}
