import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { ResourceProvider } from './components/facilities/context/ResourceContext'
import { FacilityDirectory } from './components/facilities/pages/FacilityDirectory'
import { AdminManagement } from './components/facilities/pages/AdminManagement'
import { FacilityDetailsPage } from './components/facilities/pages/FacilityDetailsPage'

export function App() {
  return (
    <ResourceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/facilities" replace />} />
          <Route path="/client" element={<Navigate to="/facilities" replace />} />
          <Route path="/facilities" element={<FacilityDirectory />} />
          <Route path="/facilities/:resourceId" element={<FacilityDetailsPage />} />
          <Route path="/admin" element={<AdminManagement />} />
          <Route path="*" element={<Navigate to="/facilities" replace />} />
        </Routes>
      </Router>
    </ResourceProvider>
  )
}

export default App
