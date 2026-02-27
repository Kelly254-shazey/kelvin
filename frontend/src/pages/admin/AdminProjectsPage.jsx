import { useCallback, useEffect, useState } from 'react'
import { adminApi, getApiError } from '../../lib/api'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

const DEFAULT_FORM = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  techTags: '',
  liveUrl: '',
  githubUrl: '',
  thumbnailUrl: '',
  galleryImages: '',
  featured: false,
  status: 'DRAFT',
}

function toArray(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function emptyToNull(value) {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function mapToPayload(form) {
  return {
    title: form.title.trim(),
    slug: emptyToNull(form.slug),
    summary: form.summary.trim(),
    description: form.description.trim(),
    techTags: toArray(form.techTags),
    liveUrl: emptyToNull(form.liveUrl),
    githubUrl: emptyToNull(form.githubUrl),
    thumbnailUrl: form.thumbnailUrl.trim(),
    galleryImages: toArray(form.galleryImages),
    featured: form.featured,
    status: form.status,
  }
}

export default function AdminProjectsPage() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(DEFAULT_FORM)
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, id: null, title: '' })

  const load = useCallback(async (params = {}) => {
    setLoading(true)
    setError('')

    try {
      const data = await adminApi.listProjects({
        page,
        size: 8,
        search: search || undefined,
        status: status || undefined,
        ...params,
      })
      setItems(data.content || [])
      setTotalPages(data.totalPages || 1)
    } catch (apiError) {
      setError(getApiError(apiError))
    } finally {
      setLoading(false)
    }
  }, [page, search, status])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setEditingId(null)
    setForm(DEFAULT_FORM)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({
      title: item.title || '',
      slug: item.slug || '',
      summary: item.summary || '',
      description: item.description || '',
      techTags: (item.techTags || []).join(', '),
      liveUrl: item.liveUrl || '',
      githubUrl: item.githubUrl || '',
      thumbnailUrl: item.thumbnailUrl || '',
      galleryImages: (item.galleryImages || []).join(', '),
      featured: Boolean(item.featured),
      status: item.status || 'DRAFT',
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setForm(DEFAULT_FORM)
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice(null)

    try {
      const payload = mapToPayload(form)
      if (editingId) {
        await adminApi.updateProject(editingId, payload)
        setNotice({ type: 'success', text: 'Project updated.' })
      } else {
        await adminApi.createProject(payload)
        setNotice({ type: 'success', text: 'Project created.' })
      }
      closeModal()
      load()
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  const remove = async (item) => {
    setConfirmDialog({ isOpen: true, id: item.id, title: item.title })
  }

  const confirmDelete = async () => {
    const id = confirmDialog.id
    setConfirmDialog({ isOpen: false, id: null, title: '' })
    try {
      await adminApi.deleteProject(id)
      setNotice({ type: 'success', text: 'Project deleted.' })
      load()
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  const toggleStatus = async (item) => {
    try {
      const nextStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
      await adminApi.setProjectStatus(item.id, nextStatus)
      setNotice({ type: 'success', text: nextStatus === 'PUBLISHED' ? 'Project published.' : 'Project moved to draft.' })
      load()
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  const toggleFeatured = async (item) => {
    try {
      await adminApi.setProjectFeatured(item.id, !item.featured)
      setNotice({ type: 'success', text: item.featured ? 'Project unfeatured.' : 'Project featured.' })
      load()
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-sm text-slate-300">Search, filter, publish, and preview project case studies.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-full border border-cyan-200/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-cyan-50"
        >
          New Project
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={search}
          onChange={(event) => {
            setPage(0)
            setSearch(event.target.value)
          }}
          placeholder="Search projects"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none ring-cyan-300/40 focus:ring"
        />
        <select
          value={status}
          onChange={(event) => {
            setPage(0)
            setStatus(event.target.value)
          }}
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none ring-cyan-300/40 focus:ring"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {notice ? (
        <p className={`text-sm ${notice.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{notice.text}</p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-white/15">
        <table className="min-w-full text-sm">
          <thead className="bg-white/10 text-left text-slate-200">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-slate-300">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-slate-300">
                  No projects found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-slate-400">/{item.slug}</p>
                  </td>
                  <td className="px-4 py-3">{item.status}</td>
                  <td className="px-4 py-3">{item.featured ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{item.updatedAt?.replace('T', ' ')?.slice(0, 16) || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button type="button" onClick={() => openEdit(item)} className="rounded-lg border border-white/20 bg-white/5 px-3 py-1 hover:bg-white/10">Edit</button>
                      <button type="button" onClick={() => toggleStatus(item)} className="rounded-lg border border-cyan-200/35 bg-cyan-300/15 px-3 py-1 text-cyan-100">{item.status === 'PUBLISHED' ? 'Set Draft' : 'Publish'}</button>
                      <button type="button" onClick={() => toggleFeatured(item)} className="rounded-lg border border-emerald-200/35 bg-emerald-300/15 px-3 py-1 text-emerald-100">{item.featured ? 'Unfeature' : 'Feature'}</button>
                      <button type="button" onClick={() => item.liveUrl && window.open(item.liveUrl, '_blank', 'noopener,noreferrer')} className="rounded-lg border border-white/20 bg-white/5 px-3 py-1 hover:bg-white/10">Preview</button>
                      <button type="button" onClick={() => remove(item)} className="rounded-lg border border-rose-300/35 bg-rose-300/15 px-3 py-1 text-rose-200">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={() => setPage((prev) => Math.max(0, prev - 1))} disabled={page === 0} className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm disabled:opacity-40">Prev</button>
        <span className="text-sm text-slate-300">Page {page + 1} of {Math.max(1, totalPages)}</span>
        <button type="button" onClick={() => setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))} disabled={page + 1 >= totalPages} className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm disabled:opacity-40">Next</button>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4">
          <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/20 bg-slate-950/95 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editingId ? 'Edit Project' : 'Create Project'}</h3>
              <button type="button" onClick={closeModal} className="rounded-lg border border-white/20 px-3 py-1 text-sm">Close</button>
            </div>

            <form className="space-y-4" onSubmit={submit}>
              <div className="grid gap-3 md:grid-cols-2">
                <input required value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Title" className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40" />
                <input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} placeholder="Slug (optional)" className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40" />
                <input required value={form.thumbnailUrl} onChange={(event) => setForm((prev) => ({ ...prev, thumbnailUrl: event.target.value }))} placeholder="Thumbnail URL" className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40 md:col-span-2" />
                <input value={form.liveUrl} onChange={(event) => setForm((prev) => ({ ...prev, liveUrl: event.target.value }))} placeholder="Live URL (optional)" className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40" />
                <input value={form.githubUrl} onChange={(event) => setForm((prev) => ({ ...prev, githubUrl: event.target.value }))} placeholder="GitHub URL (optional)" className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40" />
              </div>

              <textarea required rows={3} value={form.summary} onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))} placeholder="Summary" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40" />
              <textarea required rows={5} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Description" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40" />
              <input value={form.techTags} onChange={(event) => setForm((prev) => ({ ...prev, techTags: event.target.value }))} placeholder="Tech tags (comma separated)" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40" />
              <input value={form.galleryImages} onChange={(event) => setForm((prev) => ({ ...prev, galleryImages: event.target.value }))} placeholder="Gallery image URLs (comma separated)" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40" />

              <div className="grid gap-3 md:grid-cols-2">
                <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))} className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40">
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>

                <label className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))} />
                  Featured
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm">Cancel</button>
                <button type="submit" className="rounded-lg border border-cyan-200/45 bg-cyan-300/20 px-4 py-2 text-sm font-semibold text-cyan-50">{editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${confirmDialog.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: null, title: '' })}
      />
    </div>
  )
}

