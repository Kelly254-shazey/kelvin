import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../lib/api'

function MetricCard({ label, value, to }) {
  const content = (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-5 shadow-glass backdrop-blur-ultra transition hover:-translate-y-1">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-2 text-4xl font-black text-cyan-100">{value}</p>
    </div>
  )

  if (!to) return content
  return <Link to={to}>{content}</Link>
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState({
    projects: 0,
    services: 0,
    skills: 0,
    testimonials: 0,
    videos: 0,
    unreadMessages: 0,
  })

  useEffect(() => {
    Promise.all([
      adminApi.listProjects({ page: 0, size: 1 }),
      adminApi.listServices(),
      adminApi.listSkills(),
      adminApi.listTestimonials(),
      adminApi.listVideos({ page: 0, size: 1 }),
      adminApi.listMessages({ page: 0, size: 1, read: false }),
    ])
      .then(([projects, services, skills, testimonials, videos, unreadMessages]) => {
        setMetrics({
          projects: projects?.totalElements || 0,
          services: services?.length || 0,
          skills: skills?.length || 0,
          testimonials: testimonials?.length || 0,
          videos: videos?.totalElements || 0,
          unreadMessages: unreadMessages?.totalElements || 0,
        })
      })
      .catch(() => {
      })
  }, [])

  return (
    <div>
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <p className="mt-2 text-sm text-slate-300">Overview of your portfolio system content and inbox status.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Projects" value={metrics.projects} to="/admin/projects" />
        <MetricCard label="Services" value={metrics.services} to="/admin/services" />
        <MetricCard label="Skills" value={metrics.skills} to="/admin/skills" />
        <MetricCard label="Testimonials" value={metrics.testimonials} to="/admin/testimonials" />
        <MetricCard label="Videos" value={metrics.videos} to="/admin/videos" />
        <MetricCard label="Unread Messages" value={metrics.unreadMessages} to="/admin/messages" />
      </div>
    </div>
  )
}

