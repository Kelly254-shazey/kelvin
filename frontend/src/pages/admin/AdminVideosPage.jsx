import { useCallback, useEffect, useState } from 'react'
import { adminApi, getApiError } from '../../lib/api'
import { getEmbedUrl } from '../../lib/videoEmbed'

const DEFAULT_FORM = {
  title: '',
  description: '',
  category: 'Projects',
  videoUrl: '',
  thumbnailUrl: '',
  published: true,
}

export default function AdminVideosPage() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [published, setPublished] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(DEFAULT_FORM)

  const load = useCallback(async (params = {}) => {
    setLoading(true)
    setError('')

    try {
      const data = await adminApi.listVideos({
        page,
        size: 8,
        search: search || undefined,
        category: category || undefined,
        published: published === '' ? undefined : published === 'true',
        ...params,
      })
      setItems(data.content || [])
      setTotalPages(data.totalPages || 1)
    } catch (apiError) {
      setError(getApiError(apiError))
    } finally {
      setLoading(false)
    }
  }, [page, search, category, published])

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
      description: item.description || '',
      category: item.category || 'Projects',
      videoUrl: item.videoUrl || '',
      thumbnailUrl: item.thumbnailUrl || '',
      published: Boolean(item.published),
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

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      videoUrl: form.videoUrl.trim(),
      thumbnailUrl: form.thumbnailUrl.trim(),
      published: form.published,
    }

    try {
      if (editingId) {
        await adminApi.updateVideo(editingId, payload)
        setNotice({ type: 'success', text: 'Video updated.' })
      } else {
        await adminApi.createVideo(payload)
        setNotice({ type: 'success', text: 'Video created.' })
      }
      closeModal()
      load()
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this video?')) return
    try {
      await adminApi.deleteVideo(id)
      setNotice({ type: 'success', text: 'Video deleted.' })
      load()
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  const togglePublished = async (item) => {
    try {
      await adminApi.setVideoPublished(item.id, !item.published)
      setNotice({ type: 'success', text: item.published ? 'Video unpublished.' : 'Video published.' })
      load()
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Videos</h2>
          <p className="text-sm text-slate-300">Manage showcase videos by URL and publication state.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-full border border-cyan-200/45 bg-cyan-300/20 px-5 py-2 text-sm font-semibold text-cyan-50"
        >
          New Video
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <input
          value={search}
          onChange={(event) => {
            setPage(0)
            setSearch(event.target.value)
          }}
          placeholder="Search videos"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none ring-cyan-300/40 focus:ring"
        />
        <input
          value={category}
          onChange={(event) => {
            setPage(0)
            setCategory(event.target.value)
          }}
          placeholder="Category"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none ring-cyan-300/40 focus:ring"
        />
        <select
          value={published}
          onChange={(event) => {
            setPage(0)
            setPublished(event.target.value)
          }}
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none ring-cyan-300/40 focus:ring"
        >
          <option value="">All</option>
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
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
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-slate-300">
                  Loading...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-slate-300">
                  No videos found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.videoUrl}</p>
                  </td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3">{item.published ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button type="button" onClick={() => openEdit(item)} className="rounded-lg border border-white/20 bg-white/5 px-3 py-1 hover:bg-white/10">Edit</button>
                      <button type="button" onClick={() => togglePublished(item)} className="rounded-lg border border-cyan-200/35 bg-cyan-300/15 px-3 py-1 text-cyan-100">{item.published ? 'Unpublish' : 'Publish'}</button>
                      <button type="button" onClick={() => window.open(getEmbedUrl(item.videoUrl), '_blank', 'noopener,noreferrer')} className="rounded-lg border border-white/20 bg-white/5 px-3 py-1 hover:bg-white/10">Preview</button>
                      <button type="button" onClick={() => remove(item.id)} className="rounded-lg border border-rose-300/35 bg-rose-300/15 px-3 py-1 text-rose-200">Delete</button>
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
          <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-slate-950/95 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editingId ? 'Edit Video' : 'Create Video'}</h3>
              <button type="button" onClick={closeModal} className="rounded-lg border border-white/20 px-3 py-1 text-sm">Close</button>
            </div>

            <form className="space-y-4" onSubmit={submit}>
              <input required value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Title" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40" />
              <textarea required rows={4} value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Description" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40" />
              <input required value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} placeholder="Category" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40" />
              <input required value={form.videoUrl} onChange={(event) => setForm((prev) => ({ ...prev, videoUrl: event.target.value }))} placeholder="Video URL" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40" />
              <input required value={form.thumbnailUrl} onChange={(event) => setForm((prev) => ({ ...prev, thumbnailUrl: event.target.value }))} placeholder="Thumbnail URL" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40" />
              <label className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm">
                <input type="checkbox" checked={form.published} onChange={(event) => setForm((prev) => ({ ...prev, published: event.target.checked }))} />
                Published
              </label>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm">Cancel</button>
                <button type="submit" className="rounded-lg border border-cyan-200/45 bg-cyan-300/20 px-4 py-2 text-sm font-semibold text-cyan-50">{editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}