import { useCallback, useEffect, useState } from 'react'
import { adminApi, getApiError } from '../../lib/api'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

export default function AdminMessagesPage() {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [readFilter, setReadFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, messageId: null, deleting: false })

  const load = useCallback(async (params = {}) => {
    setLoading(true)
    setError('')

    try {
      const data = await adminApi.listMessages({
        page,
        size: 10,
        search: search || undefined,
        read: readFilter === '' ? undefined : readFilter === 'true',
        ...params,
      })
      setItems(data.content || [])
      setTotalPages(data.totalPages || 1)
    } catch (apiError) {
      setError(getApiError(apiError))
    } finally {
      setLoading(false)
    }
  }, [page, search, readFilter])

  useEffect(() => {
    load()
  }, [load])

  const openMessage = async (id) => {
    try {
      const message = await adminApi.getMessage(id)
      setSelected(message)
      setNotice({ type: 'success', text: 'Message opened.' })
      load()
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  const toggleRead = async (message) => {
    try {
      await adminApi.setMessageRead(message.id, !message.read)
      if (selected?.id === message.id) {
        setSelected((prev) => (prev ? { ...prev, read: !prev.read } : prev))
      }
      setNotice({ type: 'success', text: message.read ? 'Marked as unread.' : 'Marked as read.' })
      load()
    } catch (apiError) {
      setError(getApiError(apiError))
    }
  }

  const removeMessage = async (messageId) => {
    setConfirmDialog({ isOpen: true, messageId, deleting: false })
  }

  const confirmDelete = async () => {
    const messageId = confirmDialog.messageId
    setConfirmDialog((prev) => ({ ...prev, deleting: true }))

    try {
      await adminApi.deleteMessage(messageId)
      if (selected?.id === messageId) {
        setSelected(null)
      }

      if (items.length === 1 && page > 0) {
        setPage((prev) => Math.max(0, prev - 1))
      } else {
        load()
      }
      setNotice({ type: 'success', text: 'Message deleted successfully!' })
      setConfirmDialog({ isOpen: false, messageId: null, deleting: false })
    } catch (apiError) {
      setError(getApiError(apiError))
      setConfirmDialog({ isOpen: false, messageId: null, deleting: false })
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Messages Inbox</h2>
        <p className="text-sm text-slate-300">Read and manage contact form submissions.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={search}
          onChange={(event) => {
            setPage(0)
            setSearch(event.target.value)
          }}
          placeholder="Search by name, email, or subject"
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none ring-cyan-300/40 focus:ring"
        />
        <select
          value={readFilter}
          onChange={(event) => {
            setPage(0)
            setReadFilter(event.target.value)
          }}
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none ring-cyan-300/40 focus:ring"
        >
          <option value="">All</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {notice ? (
        <p className={`text-sm ${notice.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>{notice.text}</p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
        <div className="overflow-x-auto rounded-2xl border border-white/15">
          <table className="min-w-full text-sm">
            <thead className="bg-white/10 text-left text-slate-200">
              <tr>
                <th className="px-4 py-3">Sender</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
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
                    No messages found.
                  </td>
                </tr>
              ) : (
                items.map((message) => (
                  <tr key={message.id} className="border-t border-white/10">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{message.name}</p>
                      <p className="text-xs text-slate-400">{message.email}</p>
                    </td>
                    <td className="px-4 py-3">{message.subject}</td>
                    <td className="px-4 py-3">{message.read ? 'Read' : 'Unread'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openMessage(message.id)}
                          className="rounded-lg border border-white/20 bg-white/5 px-3 py-1 hover:bg-white/10"
                        >
                          Open
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleRead(message)}
                          className="rounded-lg border border-cyan-200/35 bg-cyan-300/15 px-3 py-1 text-cyan-100"
                        >
                          {message.read ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeMessage(message.id)}
                          className="rounded-lg border border-rose-300/35 bg-rose-300/15 px-3 py-1 text-rose-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
          {selected ? (
            <div className="space-y-3">
              <h3 className="text-xl font-bold">{selected.subject}</h3>
              <p className="text-sm text-slate-300">
                {selected.name} - {selected.email}
              </p>
              <p className="text-xs text-slate-400">{selected.createdAt?.replace('T', ' ')?.slice(0, 16)}</p>
              <p className="whitespace-pre-wrap text-sm text-slate-200">{selected.body}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-300">Select a message to view details.</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(0, prev - 1))}
          disabled={page === 0}
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm text-slate-300">Page {page + 1} of {Math.max(1, totalPages)}</span>
        <button
          type="button"
          onClick={() => setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))}
          disabled={page + 1 >= totalPages}
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={confirmDialog.deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, messageId: null, deleting: false })}
      />
    </div>
  )
}