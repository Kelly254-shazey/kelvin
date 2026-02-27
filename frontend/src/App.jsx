import { AnimatePresence, motion as Motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/public/HomePage'

const ProtectedRoute = lazy(() => import('./pages/admin/ProtectedRoute'))
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminContentPage = lazy(() => import('./pages/admin/AdminContentPage'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminMessagesPage = lazy(() => import('./pages/admin/AdminMessagesPage'))
const AdminProjectsPage = lazy(() => import('./pages/admin/AdminProjectsPage'))
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'))
const AdminSkillsPage = lazy(() => import('./pages/admin/AdminSkillsPage'))
const AdminTestimonialsPage = lazy(() => import('./pages/admin/AdminTestimonialsPage'))
const AdminVideosPage = lazy(() => import('./pages/admin/AdminVideosPage'))

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

function RouteLoader() {
  return (
    <div className="app-layer min-h-screen px-4 py-6 text-white">
      <div className="mx-auto max-w-7xl text-sm text-slate-300">Loading...</div>
    </div>
  )
}

function AnimatedApp() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<RouteLoader />}>
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
        </Suspense>
      </Motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return <AnimatedApp />
}
