import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Paper, IconButton, Button, Stack, Dialog, DialogTitle, DialogContent, Snackbar, Alert, Avatar,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import dayjs from 'dayjs'
import { colors } from '../theme/colors'
import { ApplicationForm } from '../components/ApplicationForm'
import * as api from '../services/applications'
import type { Application, UpdateApplicationPayload } from '../types/application'

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

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [app, setApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.getById(id).then(setApp).catch(e => {
      setSnackbar({ message: e instanceof Error ? e.message : 'Failed to load application', severity: 'error' })
    }).finally(() => setLoading(false))
  }, [id])

  async function handleUpdate(data: UpdateApplicationPayload) {
    if (!app) return
    try {
      const updated = await api.update(app.id, data)
      setApp(updated)
      setEditing(false)
      setSnackbar({ message: 'Application updated', severity: 'success' })
    } catch (e) {
      setSnackbar({ message: e instanceof Error ? e.message : 'Failed to update', severity: 'error' })
    }
  }

  async function handleDelete() {
    if (!app) return
    try {
      await api.remove(app.id)
      navigate(-1)
    } catch (e) {
      setSnackbar({ message: e instanceof Error ? e.message : 'Failed to delete', severity: 'error' })
      setDeleteConfirm(false)
    }
  }

  if (loading) {
    return <Typography sx={{ color: colors.text }}>Loading...</Typography>
  }

  if (!app) {
    return <Typography sx={{ color: colors.text }}>Application not found.</Typography>
  }

  function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
      <Box>
        <Typography variant="caption" sx={{ color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem' }}>
          {label}
        </Typography>
        <Typography sx={{ color: colors.text, mt: 0.25, overflowWrap: 'break-word', wordBreak: 'normal', whiteSpace: 'pre-wrap' }}>{value}</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: colors.muted }}>
          <ArrowBackIcon />
        </IconButton>
        {app.logoUrl && <Avatar src={app.logoUrl} alt={app.company} sx={{ width: 32, height: 32 }} />}
        <Typography variant="h5" sx={{ fontWeight: 700, color: colors.text }}>
          {app.company}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton onClick={() => setEditing(true)}><EditIcon sx={{ color: colors.muted }} /></IconButton>
        <IconButton color="error" onClick={() => setDeleteConfirm(true)}><DeleteIcon /></IconButton>
      </Stack>

      <Paper elevation={0} sx={{ bgcolor: colors.elevation, borderRadius: 2, p: 3 }}>
        <Stack spacing={3}>
          <Field label="Role" value={app.role} />
          <Box>
            <Typography variant="caption" sx={{ color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.72rem' }}>
              Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: statusDotColors[app.status] ?? colors.muted, flexShrink: 0 }} />
              <Typography sx={{ color: colors.text }}>{statusLabels[app.status] ?? app.status}</Typography>
            </Box>
          </Box>
          <Field label="Applied" value={dayjs(app.appliedAt).format('DD/MM/YYYY')} />
          {app.description && <Field label="Description" value={<span dangerouslySetInnerHTML={{ __html: app.description }} />} />}
          {app.interviewDate && <Field label="Interview Date" value={`${dayjs(app.interviewDate).format('DD/MM/YYYY')}${app.interviewTime ? ` ${app.interviewTime}` : ''}`} />}
          {app.appliedWhere && <Field label="Applied Where" value={app.appliedWhere} />}
          {app.link && (
            <Field label="Link" value={
              <Button
                component="a"
                href={app.link}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<LinkIcon />}
                sx={{ color: colors.primary, textTransform: 'none', p: 0, minWidth: 0, maxWidth: '100%', textAlign: 'left', wordBreak: 'break-all', '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' } }}
              >
                {app.link}
              </Button>
            } />
          )}
        </Stack>
      </Paper>

      <Dialog open={editing} onClose={() => setEditing(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Application</DialogTitle>
        <DialogContent>
          <ApplicationForm initial={app} onSave={handleUpdate} onCancel={() => setEditing(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete application?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>This action cannot be undone.</Typography>
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDelete}>Delete</Button>
          </Stack>
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
