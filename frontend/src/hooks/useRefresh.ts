import { createContext, useContext } from 'react'

export const RefreshContext = createContext({ refresh: () => {}, version: 0 })

export function useRefresh() {
  return useContext(RefreshContext)
}
