import { type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import { colors } from '../theme/colors'

const DRAWER_WIDTH = 200

const NAV = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
]

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()

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
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.primary, flexShrink: 0 }} />
          <Typography variant="h6" noWrap sx={{ color: colors.text, fontSize: '1rem', letterSpacing: '-0.02em' }}>
            ApplyTrack
          </Typography>
        </Box>
        <Box sx={{ mx: 1.5, mb: 1, height: '1px', bgcolor: colors.divider }} />
        <List sx={{ px: 1 }}>
          {NAV.map(item => {
            const active = location.pathname === item.path
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  selected={active}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 1.5,
                    py: 0.8,
                    '&.Mui-selected': { backgroundColor: 'transparent' },
                    '&:hover': {
                      backgroundColor: colors.background,
                      '& .MuiListItemIcon-root': { color: colors.primary },
                      '& .MuiListItemText-primary': { color: colors.primary },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: colors.white }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ '& .MuiListItemText-primary': { fontSize: '0.88rem', color: colors.white } }}
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
      <Box component="main" sx={{ flex: 1, p: 3, overflow: 'auto', minWidth: 0 }}>
        {children}
      </Box>
    </Box>
  )
}
