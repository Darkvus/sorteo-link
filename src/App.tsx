import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { DrawPage } from './pages/DrawPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<HomePage />} />
        <Route path="/draw/:uuid" element={<DrawPage />} />
        <Route path="*"           element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
