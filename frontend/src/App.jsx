import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import 'react-quill-new/dist/quill.snow.css'; // <-- Safely injected here to protect your Fontshare imports!

// Public Components
import Navbar from './components/Navbar'

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import ImpactPulse from './pages/ImpactPulse'
import HadithiAfrika from './pages/HadithiAfrika'
import Services from './pages/Services'
import Friends from './pages/Friends'

// Admin Components & Pages
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard' 
import ImpactPulseHub from './pages/admin/ImpactPulseHub'
import ImpactPulseComposer from './pages/admin/ImpactPulseComposer'
import ImpactPulseEditor from './pages/admin/ImpactPulseEditor'

// Temporary Placeholders
const AdminHadithi = () => <div className="font-heading text-2xl font-bold text-primary mb-2">Hadithi Afrika Management (Coming Soon)</div>

function AppLayout() {
  const location = useLocation()
  
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/impact-pulse" element={<ImpactPulse />} />
        <Route path="/hadithi-afrika" element={<HadithiAfrika />} />
        <Route path="/services" element={<Services />} />
        <Route path="/friends" element={<Friends />} />

        {/* Admin Routes wrapped inside the shared AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> 
          <Route path="impact-pulse" element={<ImpactPulseHub />} />
          <Route path="impact-pulse/new/:type" element={<ImpactPulseComposer />} />
          <Route path="impact-pulse/edit/:type/:id" element={<ImpactPulseEditor />} /> 
          <Route path="hadithi-afrika" element={<AdminHadithi />} />
        </Route>
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}