import { AnimatePresence, motion as Motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Navbar from '../../components/public/Navbar'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { getApiError, getPublicBlogDocumentFileUrl, getPublicFileUrl, publicApi } from '../../lib/api'
import { getEmbedUrl } from '../../lib/videoEmbed'

const DEFAULT_CONTENT = {
  brandName: 'KELLYFLO',
  navHireCtaText: 'Hire Me',
  heroTitle: 'Crafting Digital Experiences',
  heroHighlight: 'Future',
  heroSubheadline: 'Creative Developer • Brand Designer • Systems Architect',
  heroDescription:
    'I design and build powerful digital systems that merge creativity and technology into impactful solutions.',
  heroPrimaryCtaText: 'View My Work',
  heroPrimaryCtaLink: '#work',
  heroSecondaryCtaText: "Let's Build Something iconic",
  heroSecondaryCtaLink: '#contact',
  heroTagOne: 'Full Stack Developer',
  heroTagTwo: 'UI/UX Expert',
  heroTagThree: 'Payment Integrations',
  profileImageUrl:
    'https://res.cloudinary.com/dqdyjocsq/image/upload/v1772151371/me_lbghur.jpg',
  aboutTitle: 'Who is Kelvin Simiyu?',
  aboutDescription: "I'm a multidisciplinary creative engineer dedicated to transforming ideas into reality.",
  statOneValue: '50+',
  statOneLabel: 'Projects Completed',
  statTwoValue: '10+',
  statTwoLabel: 'Technologies Mastered',
  statThreeValue: '20+',
  statThreeLabel: 'Clients Served',
  servicesTitle: 'My Services',
  workTitle: 'Work / Projects',
  skillsTitle: 'Skills',
  testimonialsTitle: 'Testimonials',
  videosTitle: 'Videos Showcase',
  contactTitle: 'Contact',
  contactCardTitle: 'Reach Me',
  contactEmail: 'kelly123simiyu@gmail.com',
  whatsappUrl: 'https://wa.me/254741178450',
  linkedinUrl: 'https://www.linkedin.com/in/kelvin-simiyu-b04244354',
  tiktokUrl: 'https://www.tiktok.com/@kelly.the.money.m',
  githubUrl: 'https://github.com/kelvin-simiyu',
  resumeOriginalName: '',
  resumeStoredName: '',
  resumeVisible: false,
  resumeDownloadEnabled: false,
  cvOriginalName: '',
  cvStoredName: '',
  cvVisible: false,
  cvDownloadEnabled: false,
}

const FALLBACK_SERVICES = [
  { id: 1, title: 'Web Development', description: 'Building modern and responsive websites', icon: '</>' },
  { id: 2, title: 'System Architecture', description: 'Robust backend and scalable solutions', icon: '▤' },
  { id: 3, title: 'Brand & Design', description: 'Crafting unique logos and visual identities', icon: '✦' },
  { id: 4, title: 'Academic Writing', description: 'Research papers and scholarly articles', icon: '🗎' },
  { id: 5, title: 'UI/UX Design', description: 'User-centered interface design', icon: '▣' },
  { id: 6, title: 'Payment Integration', description: 'M-Pesa & Stripe Solutions', icon: '▤' },
]

const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: 'FinFlow Payments Platform',
    slug: 'finflow-payments-platform',
    summary: 'Cross-border payment and reconciliation suite for SMEs.',
    techTags: ['Java', 'Spring Boot', 'MySQL', 'React'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://example.com',
    featured: true,
  },
  {
    id: 2,
    title: 'Nova Design System',
    slug: 'nova-design-system',
    summary: 'Reusable UI system with premium interactions and visual consistency.',
    techTags: ['React', 'UI/UX'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://example.com',
    featured: true,
  },
  {
    id: 3,
    title: 'TutorPro LMS',
    slug: 'tutorpro-lms',
    summary: 'Learning management platform with analytics and role-based dashboards.',
    techTags: ['Projects', 'Java', 'React'],
    thumbnailUrl:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
    liveUrl: 'https://example.com',
    featured: false,
  },
]

const FALLBACK_SKILLS = [
  { id: 1, category: 'Frontend', name: 'React', level: 95 },
  { id: 2, category: 'Frontend', name: 'Tailwind CSS', level: 92 },
  { id: 3, category: 'Backend', name: 'Spring Boot', level: 94 },
  { id: 4, category: 'Backend', name: 'Spring Security/JWT', level: 90 },
  { id: 5, category: 'Database', name: 'MySQL', level: 91 },
  { id: 6, category: 'Design', name: 'UI/UX Systems', level: 88 },
]

const FALLBACK_TESTIMONIALS = [
  {
    id: 1,
    name: 'Aisha Njeri',
    role: 'Product Lead, NeoPay',
    quote: 'Kelvin blends product design and engineering depth better than any dev partner we have worked with.',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: 2,
    name: 'Brian Otieno',
    role: 'Founder, TekBridge',
    quote: 'Execution quality was outstanding from architecture decisions to polished UI details.',
    avatarUrl: 'https://randomuser.me/api/portraits/men/51.jpg',
  },
]

const FALLBACK_VIDEOS = [
  {
    id: 1,
    title: 'Spring Boot JWT Authentication Deep Dive',
    description: 'Full setup from security config to role-protected APIs.',
    category: 'Java',
    videoUrl: 'https://www.youtube.com/watch?v=KxqlJblhzfI',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'React Glassmorphism Portfolio',
    description: 'Building premium portfolio UI using React and Tailwind.',
    category: 'React',
    videoUrl: 'https://vimeo.com/76979871',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Product UI/UX Breakdown',
    description: 'Design hierarchy and interaction strategy for modern products.',
    category: 'UI/UX',
    videoUrl: 'https://drive.google.com/file/d/1x2z3ExampleId/view?usp=sharing',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80',
  },
]

function createSeededRandom(seed) {
  let state = seed;
  return function() {
      state = (state * 9301 + 49297) % 233280;
      return state / 233280;
  };
}

function Particles() {
  const random = useMemo(() => createSeededRandom(12345), []);
  const particles = useMemo(
    () =>
      Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        x: random() * 100,
        y: random() * 100,
        size: random() * 3 + 1,
        duration: random() * 15 + 10,
        delay: random() * 5,
      })),
    [random],
  )

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <Motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: 0.1 }}
          animate={{ y: [0, -100, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
        />
      ))}
    </div>
  )
}

function NeonFloatingLights() {
  const random = useMemo(() => createSeededRandom(54321), []);
  const lights = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: random() * 100,
        y: random() * 100,
        size: random() * 4 + 6,
        duration: random() * 8 + 12,
        delay: random() * 3,
        color: ['#00F5D4', '#00C2FF', '#7000ff', '#FF006E'][i % 4],
      })),
    [random],
  )

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {lights.map((light) => (
        <Motion.div
          key={light.id}
          className="absolute rounded-full"
          style={{
            left: `${light.x}%`,
            top: `${light.y}%`,
            width: light.size,
            height: light.size,
            background: light.color,
            boxShadow: `0 0 ${light.size * 1.5}px ${light.color}`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [-20, 20, -20],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: light.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: light.delay,
          }}
        />
      ))}
    </div>
  )
}

function StackedProfile({ tags, profileImageUrl }) {
  return (
    <div className="relative mx-auto h-[380px] w-full max-w-[520px]">
      {/* Profile Image - Prominent on the right */}
      <div className="absolute right-0 top-1/2 z-40 h-[280px] w-[280px] -translate-y-1/2 rounded-full border-2 border-[#00F5D4]/50 bg-[#050B18]/50 p-3 shadow-[0_0_60px_rgba(0,245,212,0.4)] backdrop-blur-sm">
        <div className="h-full w-full overflow-hidden rounded-full border border-white/20 shadow-[inset_0_0_40px_rgba(0,245,212,0.2)]">
          <img src={profileImageUrl} alt="Kelvin Simiyu" className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Stacked Glass Cards Behind Profile */}
      {[0, 1, 2].map((layer) => (
        <div
          key={layer}
          className="absolute h-[220px] w-[220px] rounded-[16px] border border-[#00ffc8]/30 bg-white/5 backdrop-blur-2xl"
          style={{
            right: `${layer * 12}px`,
            top: `${layer * 12}px`,
            opacity: 1 - layer * 0.2,
            boxShadow: layer === 0 ? '0 0 35px rgba(0, 245, 212, 0.3)' : 'none',
            zIndex: 15 - layer,
          }}
        />
      ))}

      {/* Tag Cards on the Left */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2.5 w-[160px]">
        {tags.map((chip, index) => (
          <Motion.div
            key={chip}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="rounded-lg border border-[#00F5D4]/40 bg-[#050B18]/80 px-3 py-2 text-xs font-bold text-[#00F5D4] shadow-[0_0_15px_rgba(0,245,212,0.2)] backdrop-blur-md"
          >
            {chip}
          </Motion.div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ value, label }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className="rounded-[24px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:border-[#00F5D4]/30 transition-colors duration-300"
    >
      <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 md:text-6xl">{value}</p>
      <p className="mt-2 text-sm font-medium uppercase tracking-wider text-[#00F5D4]">{label}</p>
    </Motion.div>
  )
}

function ServiceCard({ service }) {
  return (
    <Motion.div
      whileHover={{ y: -10, boxShadow: '0 0 50px rgba(0, 245, 212, 0.15)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      className="group rounded-[24px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-[#00F5D4]/50 hover:bg-white/8"
    >
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00F5D4]/10 text-3xl text-[#00F5D4] shadow-[0_0_20px_rgba(0,245,212,0.2)] group-hover:scale-110 transition-transform duration-300">
        {service.icon || '◈'}
      </div>
      <h3 className="text-2xl font-bold text-white group-hover:text-[#00F5D4] transition-colors">{service.title}</h3>
      <p className="mt-3 text-slate-400 leading-relaxed">{service.description}</p>
    </Motion.div>
  )
}

function VideoModal({ video, onClose }) {
  if (!video) return null

  return (
    <AnimatePresence>
      <Motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <Motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          className="w-full max-w-5xl rounded-[24px] border border-white/20 bg-[#061529]/92 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white md:text-2xl">{video.title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 px-3 py-1 text-sm text-slate-100"
            >
              Back
            </button>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 pb-[56.25%]">
            <iframe
              src={getEmbedUrl(video.videoUrl)}
              title={video.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="mt-3 text-slate-200">{video.description}</p>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  )
}

function getFileExtension(fileName = '') {
  const idx = fileName.lastIndexOf('.')
  return idx >= 0 ? fileName.slice(idx + 1).toLowerCase() : ''
}

function DocumentModal({ documentItem, onClose }) {
  if (!documentItem) return null

  const extension = getFileExtension(documentItem.fileName)
  const isPdf = extension === 'pdf'
  const previewUrl = documentItem.readUrl

  return (
    <AnimatePresence>
      <Motion.div
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <Motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          className="w-full max-w-5xl rounded-[24px] border border-white/20 bg-[#061529]/96 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white md:text-2xl">{documentItem.title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 px-3 py-1 text-sm text-slate-100"
            >
              Back
            </button>
          </div>

          {isPdf ? (
            <div className="relative overflow-hidden rounded-2xl border border-white/10">
              <iframe
                src={previewUrl}
                title={documentItem.title}
                className="h-[72vh] w-full"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
              Preview works best for PDF files. This file type can be downloaded and opened locally.
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            {documentItem.downloadEnabled ? (
              <a
                href={documentItem.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#00F5D4]/50 bg-[#00F5D4]/10 px-5 py-2 text-sm font-semibold text-[#00F5D4]"
              >
                Download {documentItem.title}
              </a>
            ) : (
              <span className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-slate-300">
                Download disabled by admin
              </span>
            )}
          </div>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  )
}

export default function HomePage() {
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [services, setServices] = useState(FALLBACK_SERVICES)
  const [projects, setProjects] = useState(FALLBACK_PROJECTS)
  const [skills, setSkills] = useState(FALLBACK_SKILLS)
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS)
  const [videos, setVideos] = useState(FALLBACK_VIDEOS)
  const [extraBlogDocuments, setExtraBlogDocuments] = useState([])

  const [projectFilter, setProjectFilter] = useState('All')
  const [videoFilter, setVideoFilter] = useState('All')
  const [activeVideo, setActiveVideo] = useState(null)
  const [activeDocument, setActiveDocument] = useState(null)
  const videoHistoryPushedRef = useRef(false)
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  const [contact, setContact] = useState({ name: '', email: '', subject: '', body: '' })
  const [contactNotice, setContactNotice] = useState(null)
  const [sending, setSending] = useState(false)
  const [contactConfirmDialog, setContactConfirmDialog] = useState({ isOpen: false, submitting: false })

  useEffect(() => {
    let mounted = true

    Promise.allSettled([
      publicApi.getContent(),
      publicApi.getBlogDocuments(),
      publicApi.getServices(),
      publicApi.getProjects(),
      publicApi.getSkills(),
      publicApi.getTestimonials(),
      publicApi.getVideos(),
    ])
      .then((results) => {
        if (!mounted) return
        const [contentResult, blogResult, servicesResult, projectsResult, skillsResult, testimonialsResult, videosResult] = results
        if (contentResult.status === 'fulfilled' && contentResult.value) {
          setContent((prev) => ({ ...prev, ...contentResult.value }))
        }
        if (blogResult.status === 'fulfilled' && Array.isArray(blogResult.value)) {
          setExtraBlogDocuments(blogResult.value)
        }
        if (servicesResult.status === 'fulfilled' && Array.isArray(servicesResult.value)) {
          setServices(
            servicesResult.value.map((item, index) => ({
              ...item,
              icon: item.icon || FALLBACK_SERVICES[index]?.icon || '◈',
            })),
          )
        }
        if (projectsResult.status === 'fulfilled' && Array.isArray(projectsResult.value)) setProjects(projectsResult.value)
        if (skillsResult.status === 'fulfilled' && Array.isArray(skillsResult.value)) setSkills(skillsResult.value)
        if (testimonialsResult.status === 'fulfilled' && Array.isArray(testimonialsResult.value)) setTestimonials(testimonialsResult.value)
        if (videosResult.status === 'fulfilled' && Array.isArray(videosResult.value)) setVideos(videosResult.value)
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (testimonials.length <= 1) return undefined
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const openVideo = useCallback((video) => {
    setActiveVideo(video)
    if (typeof window !== 'undefined') {
      window.history.pushState({ kellyfloVideoModal: true }, '')
      videoHistoryPushedRef.current = true
    }
  }, [])

  const closeVideo = useCallback(() => {
    if (typeof window !== 'undefined' && videoHistoryPushedRef.current) {
      videoHistoryPushedRef.current = false
      window.history.back()
      return
    }
    setActiveVideo(null)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const handlePopState = () => {
      setActiveVideo(null)
      videoHistoryPushedRef.current = false
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (!activeVideo || typeof window === 'undefined') return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeVideo()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeVideo, closeVideo])

  const serviceList = useMemo(() => services.slice(0, 6), [services])

  const heroTags = useMemo(
    () => [content.heroTagOne, content.heroTagTwo, content.heroTagThree].filter(Boolean),
    [content.heroTagOne, content.heroTagTwo, content.heroTagThree],
  )

  const projectFilters = useMemo(() => {
    const tags = new Set(['All'])
    projects.forEach((project) => {
      ;(project.techTags || []).forEach((tag) => tags.add(tag))
    })
    return [...tags]
  }, [projects])

  const filteredProjects = useMemo(
    () => projects.filter((project) => (projectFilter === 'All' ? true : (project.techTags || []).includes(projectFilter))),
    [projects, projectFilter],
  )

  const filteredVideos = useMemo(
    () =>
      videos.filter((video) =>
        videoFilter === 'All' ? true : (video.category || '').toLowerCase() === videoFilter.toLowerCase(),
      ),
    [videos, videoFilter],
  )

  const videoFilters = useMemo(() => {
    const categories = new Set(['All'])
    videos.forEach((video) => {
      const category = (video.category || '').trim()
      if (category) categories.add(category)
    })
    return [...categories]
  }, [videos])

  const groupedSkills = useMemo(() => {
    return skills.reduce((acc, skill) => {
      const key = skill.category || 'General'
      if (!acc[key]) acc[key] = []
      acc[key].push(skill)
      return acc
    }, {})
  }, [skills])

  const blogDocuments = useMemo(() => {
    const items = []
    if (content.resumeStoredName) {
      const readUrl = `${getPublicFileUrl('resume')}?download=false`
      items.push({
        key: 'resume',
        title: 'Resume',
        fileName: content.resumeOriginalName || 'Resume',
        downloadEnabled: Boolean(content.resumeDownloadEnabled),
        readUrl,
        downloadUrl: `${getPublicFileUrl('resume')}?download=true`,
      })
    }
    if (content.cvStoredName) {
      const readUrl = `${getPublicFileUrl('cv')}?download=false`
      items.push({
        key: 'cv',
        title: 'CV',
        fileName: content.cvOriginalName || 'CV',
        downloadEnabled: Boolean(content.cvDownloadEnabled),
        readUrl,
        downloadUrl: `${getPublicFileUrl('cv')}?download=true`,
      })
    }
    extraBlogDocuments.forEach((doc) => {
      if (!doc?.id) return
      const readUrl = `${getPublicBlogDocumentFileUrl(doc.id)}?download=false`
      items.push({
        key: `doc-${doc.id}`,
        title: doc.title || 'Document',
        fileName: doc.fileName || 'Document',
        downloadEnabled: Boolean(doc.downloadEnabled),
        readUrl,
        downloadUrl: `${getPublicBlogDocumentFileUrl(doc.id)}?download=true`,
      })
    })
    return items
  }, [
    content.resumeStoredName,
    content.resumeOriginalName,
    content.resumeDownloadEnabled,
    content.cvStoredName,
    content.cvOriginalName,
    content.cvDownloadEnabled,
    extraBlogDocuments,
  ])

  const activeTestimonial = testimonials[testimonialIndex] || FALLBACK_TESTIMONIALS[0]

  const handleContactChange = (event) => {
    const { name, value } = event.target
    setContact((prev) => ({ ...prev, [name]: value }))
  }

  const handleContactSubmit = async (event) => {
    event.preventDefault()
    setContactConfirmDialog({ isOpen: true, submitting: false })
  }

  const confirmContactSubmit = async () => {
    setContactConfirmDialog((prev) => ({ ...prev, submitting: true }))
    setSending(true)
    setContactNotice(null)

    try {
      await publicApi.sendMessage(contact)
      setContact({ name: '', email: '', subject: '', body: '' })
      setContactNotice({ type: 'success', text: '✓ Message sent successfully! I will get back to you shortly.' })
      setContactConfirmDialog({ isOpen: false, submitting: false })
    } catch (error) {
      setContactNotice({ type: 'error', text: getApiError(error) })
      setContactConfirmDialog({ isOpen: false, submitting: false })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030815] text-white selection:bg-[#00F5D4] selection:text-[#050B18] overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* Brighter background gradients */}
         <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-[#00F5D4]/25 blur-[120px]" />
         <div className="absolute bottom-[10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-[#00C2FF]/25 blur-[100px]" />
         <div className="absolute top-[20%] right-[20%] h-[300px] w-[300px] rounded-full bg-[#7000ff]/20 blur-[80px]" />
         <div className="absolute top-[40%] left-[10%] h-[400px] w-[400px] rounded-full bg-[#FF006E]/15 blur-[90px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
         <Particles />
         <NeonFloatingLights />
      </div>

      <Navbar brandName={content.brandName} hireCtaText={content.navHireCtaText} />

      <main className="relative z-10">
        <section
          id="home"
          className="relative mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-6 px-4 pb-8 pt-20 md:pt-28 md:px-8 lg:grid-cols-[1fr_450px] lg:gap-10 lg:items-center"
        >
          <div>
            <h1 className="text-[36px] leading-[1.1] tracking-tight font-bold text-white sm:text-[48px] md:text-[64px] lg:text-[72px]">
              {content.heroTitle}
              <br />
              That <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5D4] to-[#00C2FF] drop-shadow-[0_0_15px_rgba(0,245,212,0.4)]">{content.heroHighlight}</span>.
            </h1>

            <p className="mt-4 border-l-2 border-[#00F5D4] pl-4 text-base text-slate-300 sm:text-lg md:text-xl font-light">
              {content.heroSubheadline}
            </p>

            <p className="mt-4 max-w-[600px] text-sm leading-relaxed text-slate-400 sm:text-base md:text-lg">{content.heroDescription}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Motion.a
                href={content.heroPrimaryCtaLink || '#work'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-full border border-[#00F5D4]/40 bg-[#00F5D4]/5 px-8 py-4 text-sm font-bold text-[#00F5D4] transition-all hover:bg-[#00F5D4]/10 hover:shadow-[0_0_30px_rgba(0,245,212,0.3)]"
              >
                {content.heroPrimaryCtaText}
              </Motion.a>
              <Motion.a
                href={content.heroSecondaryCtaLink || '#contact'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                animate={{ boxShadow: ['0 0 20px rgba(0,245,212,0.3)', '0 0 35px rgba(0,245,212,0.6)', '0 0 20px rgba(0,245,212,0.3)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-full bg-[#00F5D4] px-8 py-4 text-sm font-bold text-[#050B18]"
              >
                {content.heroSecondaryCtaText}
              </Motion.a>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {content.resumeStoredName && content.resumeDownloadEnabled ? (
                <a
                  href={`${getPublicFileUrl('resume')}?download=true`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/25 bg-white/10 px-6 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
                >
                  Download Resume
                </a>
              ) : null}
              {content.cvStoredName && content.cvDownloadEnabled ? (
                <a
                  href={`${getPublicFileUrl('cv')}?download=true`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/25 bg-white/10 px-6 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
                >
                  Download CV
                </a>
              ) : null}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px w-20 bg-white/20" />
              <div className="flex gap-5">
                <a href={content.linkedinUrl} target="_blank" rel="noreferrer" className="text-slate-400 transition-colors hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                </a>
                <a href={content.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 transition-colors hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                </a>
                <a href={content.tiktokUrl} target="_blank" rel="noreferrer" className="text-slate-400 transition-colors hover:text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 6.88a4.5 4.5 0 0 1-4.5-4.5V2h-3v13.5A4.5 4.5 0 1 1 9 9a4.42 4.42 0 0 1 2.4.72" /></svg>
                </a>
              </div>
            </div>
          </div>

          <StackedProfile tags={heroTags} profileImageUrl={content.profileImageUrl} />
          
          {/* Glowing Planet Sphere */}
          <div className="absolute bottom-0 left-[-100px] -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-[#00F5D4]/20 to-transparent blur-[60px] opacity-60" />
        </section>

        <section id="about" className="mx-auto w-full max-w-[1200px] px-4 pb-10 pt-2 md:px-8">
          <Motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center text-3xl font-semibold tracking-tight text-white md:text-[52px]"
          >
            {content.aboutTitle}
          </Motion.h2>
          <Motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-[850px] border-t border-white/20 pt-5 text-center text-base text-slate-200 md:text-lg"
          >
            {content.aboutDescription}
          </Motion.p>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            <StatCard value={content.statOneValue} label={content.statOneLabel} />
            <StatCard value={content.statTwoValue} label={content.statTwoLabel} />
            <StatCard value={content.statThreeValue} label={content.statThreeLabel} />
          </div>
        </section>

        <section id="services" className="mx-auto w-full max-w-[1200px] px-4 pb-16 md:px-8">
          <Motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center text-3xl font-semibold tracking-tight text-white md:text-[52px]"
          >
            {content.servicesTitle}
          </Motion.h2>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {serviceList.map((service) => (
              <ServiceCard key={service.id || service.title} service={service} />
            ))}
          </div>
        </section>

        <section id="work" className="mx-auto w-full max-w-[1200px] px-4 pb-16 md:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-white md:text-[52px]">{content.workTitle}</h2>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {projectFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setProjectFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  projectFilter === filter
                    ? 'border-[#00F5D4]/50 bg-[#00F5D4]/20 text-[#00F5D4]'
                    : 'border-white/25 bg-white/5 text-slate-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div key={project.id || project.slug} className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-[#00F5D4]/30 hover:bg-white/8">
                <div
                  className="h-44 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(2,7,18,0.8), rgba(2,7,18,0.2)), url(${project.thumbnailUrl})`,
                  }}
                />
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                    {project.featured ? (
                      <span className="rounded-full border border-[#00F5D4]/40 bg-[#00F5D4]/10 px-2.5 py-1 text-xs font-semibold text-[#00F5D4]">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-300">{project.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.techTags || []).slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="mx-auto w-full max-w-[1200px] px-4 pb-16 md:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-white md:text-[52px]">{content.skillsTitle}</h2>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedSkills).map(([category, list]) => (
              <div key={category} className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-[#00F5D4]">{category}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {list.map((skill) => (
                    <span
                      key={`${category}-${skill.name}`}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200"
                    >
                      {skill.name}
                      {skill.level ? ` ${skill.level}%` : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="mx-auto w-full max-w-[1200px] px-4 pb-16 md:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-white md:text-[52px]">{content.testimonialsTitle}</h2>

          <div className="mx-auto mt-8 max-w-3xl rounded-[24px] border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
            <img
              src={activeTestimonial.avatarUrl || 'https://randomuser.me/api/portraits/men/11.jpg'}
              alt={activeTestimonial.name}
              className="mx-auto h-16 w-16 rounded-full border border-white/20 object-cover"
            />
            <p className="mt-5 text-lg leading-relaxed text-slate-100">&ldquo;{activeTestimonial.quote}&rdquo;</p>
            <p className="mt-4 font-semibold text-white">{activeTestimonial.name}</p>
            <p className="text-sm text-slate-200">{activeTestimonial.role}</p>
          </div>
        </section>

        <section id="videos" className="mx-auto w-full max-w-[1200px] px-4 pb-16 md:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-white md:text-[52px]">{content.videosTitle}</h2>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {videoFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setVideoFilter(filter)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  videoFilter === filter
                    ? 'border-[#00F5D4]/50 bg-[#00F5D4]/20 text-[#00F5D4]'
                    : 'border-white/25 bg-white/5 text-slate-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => (
              <button
                key={video.id || video.title}
                type="button"
                onClick={() => openVideo(video)}
                className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5 text-left backdrop-blur-xl transition-all hover:border-[#00F5D4]/30 hover:bg-white/8"
              >
                <div
                  className="h-44 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(2,7,18,0.74), rgba(2,7,18,0.2)), url(${video.thumbnailUrl})`,
                  }}
                >
                  <div className="flex h-full items-center justify-center">
                    <span className="rounded-full border border-[#00F5D4]/40 bg-[#00F5D4]/10 px-4 py-2 text-sm font-semibold text-[#00F5D4]">
                      Play
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#00F5D4]">{video.category}</p>
                  <h3 className="mt-2 text-lg font-bold text-white">{video.title}</h3>
                  <p className="mt-2 text-sm text-slate-100">{video.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="blog" className="mx-auto w-full max-w-[1200px] px-4 pb-20 md:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-white md:text-[52px]">Blog Docs</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-300 md:text-base">
            Read Resume, CV, and extra blog documents directly here. Download is available only when enabled by admin.
          </p>

          {blogDocuments.length === 0 ? (
            <div className="mx-auto mt-8 max-w-3xl rounded-[24px] border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-300 backdrop-blur-xl">
              No public documents available yet.
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              {blogDocuments.map((doc) => (
                <div key={doc.key} className="rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#00F5D4]">{doc.title}</p>
                  <h3 className="mt-2 text-xl font-bold text-white">{doc.fileName}</h3>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveDocument(doc)}
                      className="rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
                    >
                      Read
                    </button>
                    {doc.downloadEnabled ? (
                      <a
                        href={doc.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-[#00F5D4]/50 bg-[#00F5D4]/10 px-5 py-2 text-sm font-semibold text-[#00F5D4]"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-slate-300">
                        Download disabled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="contact" className="mx-auto w-full max-w-[1200px] px-4 pb-12 md:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-white md:text-[52px]">{content.contactTitle}</h2>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:col-span-3">
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    name="name"
                    value={contact.name}
                    onChange={handleContactChange}
                    required
                    placeholder="Your name"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5D4]/50 focus:bg-white/10"
                  />
                  <input
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={handleContactChange}
                    required
                    placeholder="Your email"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5D4]/50 focus:bg-white/10"
                  />
                </div>

                <input
                  name="subject"
                  value={contact.subject}
                  onChange={handleContactChange}
                  required
                  placeholder="Subject"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5D4]/50 focus:bg-white/10"
                />

                <textarea
                  name="body"
                  value={contact.body}
                  onChange={handleContactChange}
                  required
                  rows={6}
                  placeholder="Tell me about your project"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[#00F5D4]/50 focus:bg-white/10"
                />

                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-full bg-[#00F5D4] px-8 py-3 text-sm font-bold text-[#050B18] shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all hover:shadow-[0_0_30px_rgba(0,245,212,0.6)] disabled:opacity-60"
                >
                  {sending ? 'Sending...' : 'Send Message'}
                </button>

                {contactNotice ? (
                  <p className={`text-sm ${contactNotice.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {contactNotice.text}
                  </p>
                ) : null}
              </form>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:col-span-2">
              <h3 className="text-2xl font-bold text-white">{content.contactCardTitle || 'Reach Me'}</h3>
              <p className="mt-3 text-slate-100">{content.contactEmail}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={content.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-[#00F5D4]/40 bg-[#00F5D4]/10 px-6 py-2 text-sm font-semibold text-[#00F5D4] hover:bg-[#00F5D4]/20 transition"
                >
                  WhatsApp
                </a>
                <a
                  href={content.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-blue-400/40 bg-blue-500/10 px-6 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-500/20 transition"
                >
                  LinkedIn
                </a>
                <a
                  href={content.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-slate-400/40 bg-slate-500/10 px-6 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-500/20 transition"
                >
                  GitHub
                </a>
                <a
                  href={content.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-pink-400/40 bg-pink-500/10 px-6 py-2 text-sm font-semibold text-pink-300 hover:bg-pink-500/20 transition"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-[#061529]/65 px-4 pb-10 pt-8 backdrop-blur-xl md:px-8">
        <div className="mx-auto grid w-full max-w-[1200px] gap-6 md:grid-cols-3">
          <Motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-2xl font-black tracking-tight text-white">{content.brandName || 'KELLYFLO'}</p>
            <p className="mt-3 max-w-sm text-sm text-slate-300">
              Premium digital products, full-stack systems, and brand-focused experiences.
            </p>
          </Motion.div>

          <Motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#00F5D4]">Quick Links</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { label: 'Home', href: '#home' },
                { label: 'About', href: '#about' },
                { label: 'Services', href: '#services' },
                { label: 'Work', href: '#work' },
                { label: 'Skills', href: '#skills' },
                { label: 'Videos', href: '#videos' },
                { label: 'Contact', href: '#contact' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-[#00F5D4]/35 hover:text-[#00F5D4]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </Motion.div>

          <Motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#00F5D4]">Connect</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={content.linkedinUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-blue-300/40 hover:text-blue-200">LinkedIn</a>
              <a href={content.githubUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-300/40 hover:text-white">GitHub</a>
              <a href={content.whatsappUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-emerald-300/40 hover:text-emerald-200">WhatsApp</a>
              {content.resumeStoredName && content.resumeDownloadEnabled ? (
                <a href={`${getPublicFileUrl('resume')}?download=true`} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-[#00F5D4]/35 hover:text-[#00F5D4]">Resume</a>
              ) : null}
              {content.cvStoredName && content.cvDownloadEnabled ? (
                <a href={`${getPublicFileUrl('cv')}?download=true`} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-[#00F5D4]/35 hover:text-[#00F5D4]">CV</a>
              ) : null}
            </div>
            <p className="mt-4 text-xs text-slate-400">powered by kelly123simiyu@gmail.com  at {content.brandName || 'KELLYFLO'}.</p>
          </Motion.div>
        </div>
      </footer>

      <VideoModal video={activeVideo} onClose={closeVideo} />
      <DocumentModal documentItem={activeDocument} onClose={() => setActiveDocument(null)} />
      
      <ConfirmDialog
        isOpen={contactConfirmDialog.isOpen}
        title="Send Message"
        message={`Send message from ${contact.name} (${contact.email})?\n\nSubject: ${contact.subject}`}
        confirmText="Send"
        cancelText="Cancel"
        isDangerous={false}
        isLoading={contactConfirmDialog.submitting}
        onConfirm={confirmContactSubmit}
        onCancel={() => setContactConfirmDialog({ isOpen: false, submitting: false })}
      />
    </div>
  )
}
