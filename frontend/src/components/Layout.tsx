import { useState, useEffect, useMemo, useCallback, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Fab, Dialog, DialogTitle, DialogContent, Snackbar, Alert,
  IconButton, Popover, Stack, Badge,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { PickerDay } from '@mui/x-date-pickers/PickerDay'
import dayjs from 'dayjs'
import { colors } from '../theme/colors'
import { ApplicationForm } from './ApplicationForm'
import { useRefresh } from '../hooks/useRefresh'
import * as api from '../services/applications'
import type { Application, CreateApplicationPayload, UpdateApplicationPayload } from '../types/application'

const statusDotColors: Record<string, string> = {
  applied: colors.muted,
  interviewing: colors.primary,
  offer: colors.success,
  rejected: colors.danger,
}

export function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const { refresh } = useRefresh()
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)

  const [apps, setApps] = useState<Application[]>([])
  const fetchApps = useCallback(async () => {
    try {
      setApps(await api.getAll())
    } catch { /* calendar silently fails */ }
  }, [])
  useEffect(() => { fetchApps() }, [fetchApps])

  const [calAnchor, setCalAnchor] = useState<HTMLElement | null>(null)
  const calOpen = Boolean(calAnchor)
  const handleCalClick = (e: React.MouseEvent<HTMLElement>) => setCalAnchor(e.currentTarget)
  const handleCalClose = () => setCalAnchor(null)

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

  function InterviewDay(props: any) {
    const key = props.day.format('YYYY-MM-DD')
    const appsOnDay = interviewDateMap[key]
    const hasInterview = !!appsOnDay
    return (
      <Badge color="error" variant="dot" invisible={!hasInterview}>
        <PickerDay
          {...props}
          onClick={() => {
            if (appsOnDay) {
              handleCalClose()
              navigate(`/applications/${appsOnDay[0].id}`)
            }
          }}
        />
      </Badge>
    )
  }

  async function handleCreate(data: CreateApplicationPayload | UpdateApplicationPayload) {
    try {
      await api.create(data as CreateApplicationPayload)
      setCreating(false)
      setSnackbar({ message: 'Application created', severity: 'success' })
      refresh()
      fetchApps()
    } catch (e) {
      setSnackbar({ message: e instanceof Error ? e.message : 'Failed to create application', severity: 'error' })
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: colors.background }}>
      <Box component="main" sx={{ flex: 1, p: 4, overflow: 'auto', minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
          <TrackChangesIcon sx={{ color: colors.primary, fontSize: 20, mr: 1.5 }} />
          <Typography variant="h6" noWrap sx={{ color: colors.text, fontSize: '1rem', letterSpacing: '-0.02em', fontWeight: 600 }}>
            ApplyTrack
          </Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton onClick={handleCalClick} sx={{ color: colors.muted }}>
            <CalendarMonthIcon />
          </IconButton>
        </Box>
        {children}
      </Box>

      <Popover
        open={calOpen}
        anchorEl={calAnchor}
        onClose={handleCalClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { bgcolor: colors.elevation, borderRadius: 2, p: 2, border: `1px solid ${colors.divider}`, width: 320 } } }}
      >
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
                  onClick={() => { handleCalClose(); navigate(`/applications/${app.id}`) }}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', p: 0.5, borderRadius: 1, '&:hover': { bgcolor: colors.background } }}
                >
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: statusDotColors[app.status] ?? colors.muted, flexShrink: 0 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ color: colors.text, fontSize: '0.78rem', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {app.company} - {app.role}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: colors.muted, fontSize: '0.7rem', flexShrink: 0 }}>
                    {app.interviewTime ? `${dayjs(app.interviewDate).format('DD/MM')} ${app.interviewTime}` : dayjs(app.interviewDate).format('DD/MM')}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Popover>

      <Fab
        color="primary"
        onClick={() => setCreating(true)}
        sx={{ position: 'fixed', bottom: 24, right: 24, width: 60, height: 60 }}
      >
        <AddIcon sx={{ fontSize: 28 }} />
      </Fab>

      <Dialog open={creating} onClose={() => setCreating(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Application</DialogTitle>
        <DialogContent>
          <ApplicationForm onSave={handleCreate} onCancel={() => setCreating(false)} />
        </DialogContent>
      </Dialog>

      {snackbar && (
        <Snackbar open autoHideDuration={4000} onClose={() => setSnackbar(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)} variant="filled">{snackbar.message}</Alert>
        </Snackbar>
      )}
    </Box>
  )
}
