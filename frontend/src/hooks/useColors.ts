import { useContext } from 'react'
import { ThemeModeContext } from './ThemeModeContext'
import { getColors } from '../theme/colors'

export function useColors() {
  const { mode } = useContext(ThemeModeContext)
  return getColors(mode)
}
