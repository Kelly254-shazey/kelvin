import { useEffect, useState } from 'react'
import { adminApi, getApiError } from '../../lib/api'

const DEFAULT_FORM = {
  title: '',
  description: '',
  icon: '',
  displayOrder: 0,
}

export default function AdminServicesPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(DEFAULT_FORM)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)

  const load = async () => {
    try {
      const data = await adminApi.listServices()
      setItems(data || [])
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  useEffect(() => {
    let active = true

    adminApi
      .listServices()
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
      title: form.title.trim(),
      description: form.description.trim(),
      icon: form.icon.trim() || 'Sparkles',
      displayOrder: Number(form.displayOrder) || 0,
    }

    try {
      if (editingId) {
        await adminApi.updateService(editingId, payload)
        setNotice({ type: 'success', text: 'Service updated.' })
      } else {
        await adminApi.createService(payload)
        setNotice({ type: 'success', text: 'Service created.' })
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
      title: item.title || '',
      description: item.description || '',
      icon: item.icon || '',
      displayOrder: item.displayOrder ?? 0,
    })
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this service?')) return
    try {
      await adminApi.deleteService(id)
      setNotice({ type: 'success', text: 'Service deleted.' })
      load()
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Services</h2>
        <p className="text-sm text-slate-300">Create and order your service cards.</p>
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {notice ? (
        <p className={`text-sm ${notice.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{notice.text}</p>
      ) : null}

      <form className="grid gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 md:grid-cols-2" onSubmit={submit}>
        <input
          required
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Service title"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40"
        />
        <input
          value={form.icon}
          onChange={(event) => setForm((prev) => ({ ...prev, icon: event.target.value }))}
          placeholder="Icon label"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40"
        />
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Description"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40 md:col-span-2"
        />
        <input
          type="number"
          value={form.displayOrder}
          onChange={(event) => setForm((prev) => ({ ...prev, displayOrder: event.target.value }))}
          placeholder="Display order"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40"
        />

        <div className="flex items-center justify-end gap-2 md:col-span-2">
          {editingId ? (
            <button type="button" onClick={resetForm} className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm">
              Cancel
            </button>
          ) : null}
          <button type="submit" className="rounded-lg border border-cyan-200/45 bg-cyan-300/20 px-4 py-2 text-sm font-semibold text-cyan-50">
            {editingId ? 'Update Service' : 'Add Service'}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/15">
        <table className="min-w-full text-sm">
          <thead className="bg-white/10 text-left text-slate-200">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Icon</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="px-4 py-3">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </td>
                <td className="px-4 py-3">{item.icon}</td>
                <td className="px-4 py-3">{item.displayOrder}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => edit(item)} className="rounded-lg border border-white/20 bg-white/5 px-3 py-1 hover:bg-white/10">Edit</button>
                    <button type="button" onClick={() => remove(item.id)} className="rounded-lg border border-rose-300/35 bg-rose-300/15 px-3 py-1 text-rose-200">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

