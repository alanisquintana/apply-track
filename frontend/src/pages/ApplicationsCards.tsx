import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Card, CardContent, Stack, Snackbar, Alert,
  TextField, Select, MenuItem, IconButton, Chip,
} from '@mui/material'
import Search from '@mui/icons-material/Search'
import ArrowUpward from '@mui/icons-material/ArrowUpward'
import ArrowDownward from '@mui/icons-material/ArrowDownward'
import dayjs from 'dayjs'
import { colors } from '../theme/colors'
import { useRefresh } from '../hooks/useRefresh'
import * as api from '../services/applications'
import type { Application, ApplicationStatus } from '../types/application'

const statusLabels: Record<string, string> = {
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
}

const statusDotColors: Record<string, string> = {
  applied: colors.muted,
  interviewing: colors.primary,
  offer: colors.success,
  rejected: colors.danger,
}

const statusRank: Record<string, number> = {
  interviewing: 0,
  applied: 1,
  offer: 2,
  rejected: 3,
}

const allStatuses: ApplicationStatus[] = ['applied', 'interviewing', 'offer', 'rejected']

type SortKey = 'company' | 'role' | 'status' | 'appliedAt' | 'interviewDate'

const sortLabels: Record<SortKey, string> = {
  company: 'Company',
  role: 'Role',
  status: 'Status',
  appliedAt: 'Applied',
  interviewDate: 'Interview',
}

export function ApplicationsCards() {
  const navigate = useNavigate()
  const [apps, setApps] = useState<Application[]>([])
  const { version } = useRefresh()
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('appliedAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const fetchAll = useCallback(async () => {
    try {
      const data = await api.getAll()
      setApps(data)
    } catch (e) {
      setSnackbar({ message: e instanceof Error ? e.message : 'Failed to load applications', severity: 'error' })
    }
  }, [version])

  useEffect(() => { fetchAll() }, [fetchAll])

  const filtered = useMemo(() => {
    let list = apps

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(a => a.company.toLowerCase().includes(q) || a.role.toLowerCase().includes(q))
    }

    if (statusFilter.length > 0) {
      list = list.filter(a => statusFilter.includes(a.status))
    }

    return list
  }, [apps, search, statusFilter])

  const sorted = useMemo(() => {
    const copy = [...filtered]
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
  }, [filtered, sortKey, sortDir])

  function toggleStatus(status: ApplicationStatus) {
    setStatusFilter(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status],
    )
  }

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search by company or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: <Search sx={{ color: colors.muted, mr: 1, fontSize: 20 }} />,
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: colors.elevation,
              color: colors.text,
              '& fieldset': { borderColor: colors.divider },
              '&:hover fieldset': { borderColor: colors.muted },
              '&.Mui-focused fieldset': { borderColor: colors.primary },
            },
          }}
        />

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            <Chip
              label="All"
              size="small"
              variant={statusFilter.length === 0 ? 'filled' : 'outlined'}
              onClick={() => setStatusFilter([])}
              sx={{
                color: statusFilter.length === 0 ? colors.background : colors.muted,
                bgcolor: statusFilter.length === 0 ? colors.primary : 'transparent',
                borderColor: colors.divider,
                '&:hover': { bgcolor: colors.primary, color: colors.background, opacity: 0.85 },
              }}
            />
            {allStatuses.map(s => (
              <Chip
                key={s}
                label={statusLabels[s]}
                size="small"
                variant={statusFilter.includes(s) ? 'filled' : 'outlined'}
                onClick={() => toggleStatus(s)}
                sx={{
                  color: statusFilter.includes(s) ? colors.background : colors.muted,
                  bgcolor: statusFilter.includes(s) ? colors.primary : 'transparent',
                  borderColor: colors.divider,
                  '&:hover': { bgcolor: colors.primary, color: colors.background, opacity: 0.85 },
                }}
              />
            ))}
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Select
            size="small"
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
            sx={{
              color: colors.text,
              bgcolor: colors.elevation,
              minWidth: 120,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.divider },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.muted },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary },
              '& .MuiSvgIcon-root': { color: colors.muted },
            }}
          >
            {Object.entries(sortLabels).map(([key, label]) => (
              <MenuItem key={key} value={key}>{label}</MenuItem>
            ))}
          </Select>

          <IconButton
            size="small"
            onClick={() => setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))}
            sx={{ color: colors.muted, border: `1px solid ${colors.divider}`, borderRadius: 1, p: '5px' }}
          >
            {sortDir === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
          </IconButton>
        </Stack>
      </Stack>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
        {sorted.map(app => (
          <Card
            key={app.id}
            elevation={0}
            onClick={() => navigate(`/applications/${app.id}`)}
            sx={{ bgcolor: colors.elevation, borderRadius: 2, cursor: 'pointer', transition: 'box-shadow 0.15s', '&:hover': { boxShadow: `0 0 0 1px ${colors.divider}` } }}
          >
            <CardContent>
              <Stack spacing={0.5} sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ color: colors.muted, fontSize: '0.72rem', textAlign: 'right' }}>
                  {dayjs(app.appliedAt).format('DD/MM/YYYY')}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0} sx={{ minWidth: 0 }}>
                  <Typography variant="body1" sx={{ color: colors.text, fontWeight: 600, lineHeight: 1.4, whiteSpace: 'nowrap' }}>
                    {app.company}
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.muted, fontSize: '0.5rem', lineHeight: 1.4, userSelect: 'none', display: 'flex', alignItems: 'center', mx: 0.8 }}>
                    ●
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.muted, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                    {app.role}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ color: statusDotColors[app.status] ?? colors.muted, fontSize: '0.6rem', lineHeight: 1.4, display: 'flex', alignItems: 'center', userSelect: 'none' }}>
                  ●
                </Typography>
                <Typography variant="body2" sx={{ color: colors.muted, fontSize: '0.82rem' }}>
                  {statusLabels[app.status] ?? app.status}
                </Typography>
              </Stack>

              <Stack spacing={0.5}>
                {app.appliedWhere && (
                  <Typography variant="caption" sx={{ color: colors.muted, fontSize: '0.75rem' }}>
                    Via: {app.appliedWhere}
                  </Typography>
                )}
                {app.interviewDate && (
                  <Typography variant="caption" sx={{ color: colors.primary, fontSize: '0.75rem' }}>
                    Interview: {dayjs(app.interviewDate).format('DD/MM/YYYY')}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {sorted.length === 0 && (
        <Typography sx={{ color: colors.muted, textAlign: 'center', mt: 6 }}>
          No applications yet.
        </Typography>
      )}

      {snackbar && (
        <Snackbar open autoHideDuration={4000} onClose={() => setSnackbar(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)} variant="filled">{snackbar.message}</Alert>
        </Snackbar>
      )}
    </Box>
  )
}
