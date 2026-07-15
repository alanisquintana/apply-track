import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ApplicationsList } from './pages/ApplicationsList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ApplicationsList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
