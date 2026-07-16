import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { Layout } from './components/Layout'
import { ApplicationsList } from './pages/ApplicationsList'
import { ApplicationDetail } from './pages/ApplicationDetail'
import { ApplicationsCards } from './pages/ApplicationsCards'
import { RefreshContext } from './hooks/useRefresh'

function App() {
  const [n, setN] = useState(0)
  const refresh = useCallback(() => setN(x => x + 1), [])

  return (
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <RefreshContext value={{ refresh, version: n }}>
          <Layout>
            <Routes>
              <Route path="/" element={<ApplicationsList />} />
              <Route path="/applications" element={<ApplicationsCards />} />
              <Route path="/applications/:id" element={<ApplicationDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </RefreshContext>
      </LocalizationProvider>
    </BrowserRouter>
  )
}

export default App
