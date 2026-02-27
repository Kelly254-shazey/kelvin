import { useEffect, useState } from 'react'
import { adminApi, getApiError } from '../../lib/api'

const DEFAULT_FORM = {
  category: '',
  name: '',
  level: '',
}

export default function AdminSkillsPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(DEFAULT_FORM)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)

  const load = async () => {
    try {
      const data = await adminApi.listSkills()
      setItems(data || [])
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  useEffect(() => {
    let active = true

    adminApi
      .listSkills()
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
      category: form.category.trim(),
      name: form.name.trim(),
      level: form.level === '' ? null : Number(form.level),
    }

    try {
      if (editingId) {
        await adminApi.updateSkill(editingId, payload)
        setNotice({ type: 'success', text: 'Skill updated.' })
      } else {
        await adminApi.createSkill(payload)
        setNotice({ type: 'success', text: 'Skill created.' })
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
      category: item.category || '',
      name: item.name || '',
      level: item.level ?? '',
    })
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this skill?')) return
    try {
      await adminApi.deleteSkill(id)
      setNotice({ type: 'success', text: 'Skill deleted.' })
      load()
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Skills</h2>
        <p className="text-sm text-slate-300">Maintain categorized skill tags and optional proficiency levels.</p>
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {notice ? (
        <p className={`text-sm ${notice.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{notice.text}</p>
      ) : null}

      <form className="grid gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 md:grid-cols-3" onSubmit={submit}>
        <input
          required
          value={form.category}
          onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
          placeholder="Category"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40"
        />
        <input
          required
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Skill name"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40"
        />
        <input
          type="number"
          min={1}
          max={100}
          value={form.level}
          onChange={(event) => setForm((prev) => ({ ...prev, level: event.target.value }))}
          placeholder="Level (optional)"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-cyan-300/40"
        />

        <div className="flex items-center justify-end gap-2 md:col-span-3">
          {editingId ? (
            <button type="button" onClick={resetForm} className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm">
              Cancel
            </button>
          ) : null}
          <button type="submit" className="rounded-lg border border-cyan-200/45 bg-cyan-300/20 px-4 py-2 text-sm font-semibold text-cyan-50">
            {editingId ? 'Update Skill' : 'Add Skill'}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/15">
        <table className="min-w-full text-sm">
          <thead className="bg-white/10 text-left text-slate-200">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Skill</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3 font-semibold text-white">{item.name}</td>
                <td className="px-4 py-3">{item.level || '-'}</td>
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

