import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './pages/admin/ProtectedRoute'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminContentPage from './pages/admin/AdminContentPage'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminMessagesPage from './pages/admin/AdminMessagesPage'
import AdminProjectsPage from './pages/admin/AdminProjectsPage'
import AdminServicesPage from './pages/admin/AdminServicesPage'
import AdminSkillsPage from './pages/admin/AdminSkillsPage'
import AdminTestimonialsPage from './pages/admin/AdminTestimonialsPage'
import AdminVideosPage from './pages/admin/AdminVideosPage'
import HomePage from './pages/public/HomePage'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

function AnimatedApp() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="services" element={<AdminServicesPage />} />
            <Route path="skills" element={<AdminSkillsPage />} />
            <Route path="testimonials" element={<AdminTestimonialsPage />} />
            <Route path="videos" element={<AdminVideosPage />} />
            <Route path="messages" element={<AdminMessagesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return <AnimatedApp />
}

