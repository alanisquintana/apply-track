import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Typography, Card, CardContent, Stack, Snackbar, Alert,
} from '@mui/material'
import dayjs from 'dayjs'
import { colors } from '../theme/colors'
import { useRefresh } from '../hooks/useRefresh'
import * as api from '../services/applications'
import type { Application } from '../types/application'

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

export function ApplicationsCards() {
  const navigate = useNavigate()
  const [apps, setApps] = useState<Application[]>([])
  const { version } = useRefresh()
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      const data = await api.getAll()
      setApps(data)
    } catch (e) {
      setSnackbar({ message: e instanceof Error ? e.message : 'Failed to load applications', severity: 'error' })
    }
  }, [version])

  useEffect(() => { fetchAll() }, [fetchAll])

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text, mb: 0.5 }}>
        Applications
      </Typography>
      <Typography variant="body2" sx={{ color: colors.text, mb: 2 }}>
        Overview of all your job applications
      </Typography>
      <Box sx={{ height: '1px', bgcolor: colors.divider, mb: 3 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
        {apps.map(app => (
          <Card
            key={app.id}
            elevation={0}
            onClick={() => navigate(`/applications/${app.id}`)}
            sx={{ bgcolor: colors.elevation, borderRadius: 2, cursor: 'pointer', transition: 'box-shadow 0.15s', '&:hover': { boxShadow: `0 0 0 1px ${colors.divider}` } }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={0} sx={{ mb: 1.5, minWidth: 0 }}>
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

              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusDotColors[app.status] ?? colors.muted, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: colors.muted, fontSize: '0.82rem' }}>
                  {statusLabels[app.status] ?? app.status}
                </Typography>
              </Stack>

              <Stack spacing={0.5}>
                <Typography variant="caption" sx={{ color: colors.muted, fontSize: '0.75rem' }}>
                  Applied: {dayjs(app.appliedAt).format('DD/MM/YYYY')}
                </Typography>
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

              {app.description && (
                <Typography variant="body2" sx={{ color: colors.muted, mt: 1.5, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {app.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {apps.length === 0 && (
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
