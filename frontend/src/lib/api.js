import axios from 'axios'
import { getToken } from './auth'

const PROD_FALLBACK_API_BASE_URL = 'https://kelvin-3.onrender.com'
const DEV_FALLBACK_API_BASE_URL = 'http://localhost:8080'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? PROD_FALLBACK_API_BASE_URL : DEV_FALLBACK_API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  const requiresAuth = config.url?.startsWith('/api/admin')

  if (token && requiresAuth) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const publicApi = {
  getContent: () => api.get('/api/public/content').then((res) => res.data),
  getBlogDocuments: () => api.get('/api/public/content/documents').then((res) => res.data),
  getProjects: (params = {}) => api.get('/api/public/projects', { params }).then((res) => res.data),
  getServices: () => api.get('/api/public/services').then((res) => res.data),
  getSkills: () => api.get('/api/public/skills').then((res) => res.data),
  getTestimonials: () => api.get('/api/public/testimonials').then((res) => res.data),
  getVideos: () => api.get('/api/public/videos').then((res) => res.data),
  sendMessage: (payload) => api.post('/api/messages', payload).then((res) => res.data),
}

export const adminApi = {
  login: (payload) => api.post('/api/auth/login', payload).then((res) => res.data),

  getContent: () => api.get('/api/admin/content').then((res) => res.data),
  updateContent: (payload) => api.put('/api/admin/content', payload).then((res) => res.data),
  uploadContentFile: (type, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api
      .post('/api/admin/content/upload', formData, {
        params: { type },
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data)
  },
  deleteContentFile: (type) => api.delete('/api/admin/content/upload', { params: { type } }).then((res) => res.data),
  listBlogDocuments: () => api.get('/api/admin/content/documents').then((res) => res.data),
  createBlogDocument: ({ title, file, visible = true, downloadEnabled = false, displayOrder = 0 }) => {
    const formData = new FormData()
    if (title) formData.append('title', title)
    formData.append('file', file)
    formData.append('visible', String(visible))
    formData.append('downloadEnabled', String(downloadEnabled))
    formData.append('displayOrder', String(displayOrder))
    return api
      .post('/api/admin/content/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data)
  },
  updateBlogDocument: (id, payload) => api.put(`/api/admin/content/documents/${id}`, payload).then((res) => res.data),
  deleteBlogDocument: (id) => api.delete(`/api/admin/content/documents/${id}`),

  listProjects: (params) => api.get('/api/admin/projects', { params }).then((res) => res.data),
  createProject: (payload) => api.post('/api/admin/projects', payload).then((res) => res.data),
  updateProject: (id, payload) => api.put(`/api/admin/projects/${id}`, payload).then((res) => res.data),
  deleteProject: (id) => api.delete(`/api/admin/projects/${id}`),
  setProjectStatus: (id, status) => api.patch(`/api/admin/projects/${id}/status`, null, { params: { status } }).then((res) => res.data),
  setProjectFeatured: (id, featured) => api.patch(`/api/admin/projects/${id}/featured`, null, { params: { featured } }).then((res) => res.data),

  listServices: () => api.get('/api/admin/services').then((res) => res.data),
  createService: (payload) => api.post('/api/admin/services', payload).then((res) => res.data),
  updateService: (id, payload) => api.put(`/api/admin/services/${id}`, payload).then((res) => res.data),
  deleteService: (id) => api.delete(`/api/admin/services/${id}`),

  listSkills: () => api.get('/api/admin/skills').then((res) => res.data),
  createSkill: (payload) => api.post('/api/admin/skills', payload).then((res) => res.data),
  updateSkill: (id, payload) => api.put(`/api/admin/skills/${id}`, payload).then((res) => res.data),
  deleteSkill: (id) => api.delete(`/api/admin/skills/${id}`),

  listTestimonials: () => api.get('/api/admin/testimonials').then((res) => res.data),
  createTestimonial: (payload) => api.post('/api/admin/testimonials', payload).then((res) => res.data),
  updateTestimonial: (id, payload) => api.put(`/api/admin/testimonials/${id}`, payload).then((res) => res.data),
  deleteTestimonial: (id) => api.delete(`/api/admin/testimonials/${id}`),

  listVideos: (params) => api.get('/api/admin/videos', { params }).then((res) => res.data),
  createVideo: (payload) => api.post('/api/admin/videos', payload).then((res) => res.data),
  updateVideo: (id, payload) => api.put(`/api/admin/videos/${id}`, payload).then((res) => res.data),
  deleteVideo: (id) => api.delete(`/api/admin/videos/${id}`),
  setVideoPublished: (id, published) => api.patch(`/api/admin/videos/${id}/published`, null, { params: { published } }).then((res) => res.data),

  listMessages: (params) => api.get('/api/admin/messages', { params }).then((res) => res.data),
  getMessage: (id) => api.get(`/api/admin/messages/${id}`).then((res) => res.data),
  setMessageRead: (id, read) => api.patch(`/api/admin/messages/${id}/read`, null, { params: { read } }).then((res) => res.data),
  deleteMessage: (id) => api.delete(`/api/admin/messages/${id}`),
}

export function getApiError(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong'
  )
}

export function getPublicFileUrl(type) {
  return `${API_BASE_URL}/api/public/content/file/${type}`
}

export function getPublicBlogDocumentFileUrl(id) {
  return `${API_BASE_URL}/api/public/content/documents/${id}/file`
}


