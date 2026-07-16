import { useState } from 'react'
import { type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Fab, Dialog, DialogTitle, DialogContent, Snackbar, Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import HomeIcon from '@mui/icons-material/Home'
import DashboardIcon from '@mui/icons-material/Dashboard'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import { colors } from '../theme/colors'
import { ApplicationForm } from './ApplicationForm'
import { useRefresh } from '../hooks/useRefresh'
import * as api from '../services/applications'
import type { CreateApplicationPayload, UpdateApplicationPayload } from '../types/application'

const DRAWER_WIDTH = 200

const NAV = [
  { label: 'Home', icon: <HomeIcon />, path: '/', match: (p: string) => p === '/' },
  { label: 'Applications', icon: <DashboardIcon />, path: '/applications', match: (p: string) => p.startsWith('/applications') },
]

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const { refresh } = useRefresh()
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)

  async function handleCreate(data: CreateApplicationPayload | UpdateApplicationPayload) {
    try {
      await api.create(data as CreateApplicationPayload)
      setCreating(false)
      setSnackbar({ message: 'Application created', severity: 'success' })
      refresh()
    } catch (e) {
      setSnackbar({ message: e instanceof Error ? e.message : 'Failed to create application', severity: 'error' })
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.background }}>
      {/* sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: colors.elevation,
            position: 'relative',
          },
        }}
      >
        <Box sx={{ px: 2, pt: 2.5, pb: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TrackChangesIcon sx={{ color: colors.primary, fontSize: 20 }} />
          <Typography variant="h6" noWrap sx={{ color: colors.text, fontSize: '1rem', letterSpacing: '-0.02em' }}>
            ApplyTrack
          </Typography>
        </Box>
        <Box sx={{ mx: 1.5, mb: 1, height: '1px', bgcolor: colors.divider }} />
        <List sx={{ px: 1 }}>
          {NAV.map(item => {
            const active = item.match(location.pathname)
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  selected={active}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 1.5,
                    py: 0.8,
                    backgroundColor: 'transparent',
                    '&.Mui-selected': { backgroundColor: 'transparent' },
                    '&:hover': {
                      backgroundColor: `${colors.background} !important`,
                      '& .MuiListItemIcon-root': { color: colors.primary },
                      '& .MuiListItemText-primary': { color: colors.primary },
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: `${colors.background} !important`,
                      '& .MuiListItemIcon-root': { color: colors.primary },
                      '& .MuiListItemText-primary': { color: colors.primary },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: colors.muted }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ '& .MuiListItemText-primary': { fontSize: '0.88rem', color: colors.muted } }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Drawer>

      {/* color divider between sidebar and content */}
      <Box sx={{ width: '1px', bgcolor: colors.divider, flexShrink: 0 }} />

      {/* main content */}
      <Box component="main" sx={{ flex: 1, p: 8, overflow: 'auto', minWidth: 0 }}>
        {children}
      </Box>

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
