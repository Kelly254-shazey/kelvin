import { useEffect, useState } from 'react'
import { adminApi, getApiError } from '../../lib/api'

const DEFAULT_FORM = {
  name: '',
  role: '',
  quote: '',
  avatarUrl: '',
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(DEFAULT_FORM)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)

  const load = async () => {
    try {
      const data = await adminApi.listTestimonials()
      setItems(data || [])
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  useEffect(() => {
    let active = true

    adminApi
      .listTestimonials()
      .then((data) => {
        if (!active) return
        setItems(data || [])
      })
      .catch((apiError) => {
        if (!active) return
        setError(getApiError(apiError))
      })

    return () => {
      active = false
    }
  }, [])

  const resetForm = () => {
    setForm(DEFAULT_FORM)
    setEditingId(null)
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice(null)

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      quote: form.quote.trim(),
      avatarUrl: form.avatarUrl.trim() || null,
    }

    try {
      if (editingId) {
        await adminApi.updateTestimonial(editingId, payload)
        setNotice({ type: 'success', text: 'Testimonial updated.' })
      } else {
        await adminApi.createTestimonial(payload)
        setNotice({ type: 'success', text: 'Testimonial created.' })
      }
      resetForm()
      load()
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  const edit = (item) => {
    setEditingId(item.id)
    setForm({
      name: item.name || '',
      role: item.role || '',
      quote: item.quote || '',
      avatarUrl: item.avatarUrl || '',
    })
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return
    try {
      await adminApi.deleteTestimonial(id)
      setNotice({ type: 'success', text: 'Testimonial deleted.' })
      load()
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Testimonials</h2>
        <p className="text-sm text-slate-300">Manage social proof quotes displayed on the public portfolio.</p>
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {notice ? (
        <p className={`text-sm ${notice.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{notice.text}</p>
      ) : null}

      <form className="grid gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 md:grid-cols-2" onSubmit={submit}>
        <input
          required
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Name"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40"
        />
        <input
          required
          value={form.role}
          onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
          placeholder="Role"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40"
        />
        <input
          value={form.avatarUrl}
          onChange={(event) => setForm((prev) => ({ ...prev, avatarUrl: event.target.value }))}
          placeholder="Avatar URL (optional)"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40 md:col-span-2"
        />
        <textarea
          required
          rows={3}
          value={form.quote}
          onChange={(event) => setForm((prev) => ({ ...prev, quote: event.target.value }))}
          placeholder="Quote"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40 md:col-span-2"
        />

        <div className="flex items-center justify-end gap-2 md:col-span-2">
          {editingId ? (
            <button type="button" onClick={resetForm} className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm">
              Cancel
            </button>
          ) : null}
          <button type="submit" className="rounded-lg border border-cyan-200/45 bg-cyan-300/20 px-4 py-2 text-sm font-semibold text-cyan-50">
            {editingId ? 'Update Testimonial' : 'Add Testimonial'}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-xs text-slate-400">{item.role}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => edit(item)} className="rounded-lg border border-white/20 bg-white/5 px-3 py-1 text-sm hover:bg-white/10">Edit</button>
                <button type="button" onClick={() => remove(item.id)} className="rounded-lg border border-rose-300/35 bg-rose-300/15 px-3 py-1 text-sm text-rose-200">Delete</button>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-200">{item.quote}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

