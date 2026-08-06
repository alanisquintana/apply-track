import { useEffect, useState } from 'react'
import { Box, IconButton, Tooltip } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import CropSquareIcon from '@mui/icons-material/CropSquare'
import FilterNoneIcon from '@mui/icons-material/FilterNone'
import CloseIcon from '@mui/icons-material/Close'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useColors } from '../hooks/useColors'

const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

const windowButtonSx = {
  borderRadius: 0,
  width: 46,
  height: '100%',
  '&:hover': { bgcolor: 'rgba(128,128,128,0.18)' },
}

export function TitleBar() {
  const colors = useColors()
  const [maximized, setMaximized] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!isTauri()) return
    const win = getCurrentWindow()
    let alive = true

    const sync = () => {
      win.isMaximized().then(v => alive && setMaximized(v))
      win.isFullscreen().then(v => alive && setFullscreen(v))
    }
    sync()
    const unlisten = win.onResized(sync)

    return () => {
      alive = false
      unlisten.then(fn => fn())
    }
  }, [])

  return (
    <Box
      data-tauri-drag-region
      sx={{
        height: 40,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        bgcolor: colors.background,
        borderBottom: `1px solid ${colors.divider}`,
        userSelect: 'none',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, flex: 1, minWidth: 0 }} data-tauri-drag-region>
        <Box
          sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: colors.primary, mr: 1 }}
        />
        <Box component="span" sx={{ color: colors.text, fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.02em' }}>
          ApplyTrack
        </Box>
      </Box>

      <Box sx={{ display: 'flex', height: '100%' }}>
        <Tooltip title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
          <IconButton
            sx={{ color: colors.muted, ...windowButtonSx }}
            onClick={async () => {
              if (!isTauri()) return
              const win = getCurrentWindow()
              const next = !fullscreen
              await win.setFullscreen(next)
              setFullscreen(next)
            }}
          >
            {fullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Minimize">
          <IconButton
            sx={{ color: colors.muted, ...windowButtonSx }}
            onClick={() => isTauri() && getCurrentWindow().minimize()}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title={maximized ? 'Restore' : 'Maximize'}>
          <IconButton
            sx={{ color: colors.muted, ...windowButtonSx }}
            onClick={() => isTauri() && getCurrentWindow().toggleMaximize()}
          >
            {maximized ? <FilterNoneIcon fontSize="small" /> : <CropSquareIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Close">
          <IconButton
            sx={{
              color: colors.muted,
              ...windowButtonSx,
              '&:hover': { bgcolor: '#e81123', color: '#fff' },
            }}
            onClick={() => isTauri() && getCurrentWindow().close()}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  )
}