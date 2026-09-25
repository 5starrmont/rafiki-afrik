import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

// Public Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import ImpactPulse from './pages/ImpactPulse'
import ImpactPulseReader from './pages/ImpactPulseReader'
import HadithiAfrika from './pages/HadithiAfrika'
import HadithiAfrikaWatch from './pages/HadithiAfrikaWatch'
import Podcasts from './pages/Podcasts'
import PodcastReader from './pages/PodcastReader'
import Services from './pages/Services'
import Friends from './pages/Friends'

// Admin Components & Pages
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard' 
import ImpactPulseHub from './pages/admin/ImpactPulseHub'
import ImpactPulseComposer from './pages/admin/ImpactPulseComposer'
import ImpactPulseEditor from './pages/admin/ImpactPulseEditor'
import HadithiAfrikaHub from './pages/admin/HadithiAfrikaHub'
import HadithiAfrikaComposer from './pages/admin/HadithiAfrikaComposer'
import HadithiAfrikaEditor from './pages/admin/HadithiAfrikaEditor'
import PodcastsHub from './pages/admin/PodcastsHub'
import PodcastComposer from './pages/admin/PodcastComposer'
import PodcastEditor from './pages/admin/PodcastEditor'

function AppLayout() {
  const location = useLocation()
  
  // Instantly scroll to the top left corner whenever the URL path changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className={!isAdminRoute ? "flex flex-col min-h-screen" : ""}>
      {!isAdminRoute && <Navbar />}

      <main className={!isAdminRoute ? "flex-grow" : ""}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/impact-pulse" element={<ImpactPulse />} />
          <Route path="/impact-pulse/:id" element={<ImpactPulseReader />} />
          <Route path="/hadithi-afrika" element={<HadithiAfrika />} />
          <Route path="/hadithi-afrika/watch" element={<HadithiAfrikaWatch />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/podcasts/:id" element={<PodcastReader />} />
          <Route path="/services" element={<Services />} />
          <Route path="/friends" element={<Friends />} />

          {/* Admin Routes wrapped inside the shared AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} /> 
            
            {/* Impact Pulse Routes */}
            <Route path="impact-pulse" element={<ImpactPulseHub />} />
            <Route path="impact-pulse/new/:type" element={<ImpactPulseComposer />} />
            <Route path="impact-pulse/edit/:type/:id" element={<ImpactPulseEditor />} /> 
            
            {/* Hadithi Afrika Routes */}
            <Route path="hadithi-afrika" element={<HadithiAfrikaHub />} />
            <Route path="hadithi-afrika/new" element={<HadithiAfrikaComposer />} />
            <Route path="hadithi-afrika/edit/:id" element={<HadithiAfrikaEditor />} />

            {/* Podcasts Routes */}
            <Route path="podcasts" element={<PodcastsHub />} />
            <Route path="podcasts/new" element={<PodcastComposer />} />
            <Route path="podcasts/edit/:id" element={<PodcastEditor />} />
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}