import { Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Emergency from './pages/Emergency'
import Report from './pages/Report'
import Track from './pages/Track'
import Submitted from './pages/Submitted'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import CaseManagement from './pages/CaseManagement'
import SettingsLayout from './pages/SettingsLayout'
import GeneralSettings from './pages/settings/GeneralSettings'
import SecuritySettings from './pages/settings/SecuritySettings'
import PrivacySettings from './pages/settings/PrivacySettings'
import SystemBackup from './pages/settings/SystemBackup'
import Integrations from './pages/settings/Integrations'
import AuditLogs from './pages/settings/AuditLogs'
import Contact from './pages/Contact'
import UserManagement from './pages/UserManagement'
import DistrictSetup from './pages/DistrictSetup'

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff]">
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/report" element={<Report />} />
          <Route path="/track" element={<Track />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/submitted" element={<Submitted />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Admin routes are rendered without public Navbar/Footer */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/case-management" element={<CaseManagement />} />
        <Route path="/case-management/create" element={<Report />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/district-setup" element={<DistrictSetup />} />
        <Route path="/settings" element={<SettingsLayout />}>
          <Route index element={<GeneralSettings />} />
          <Route path="general" element={<GeneralSettings />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="privacy" element={<PrivacySettings />} />
          <Route path="backup" element={<SystemBackup />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App