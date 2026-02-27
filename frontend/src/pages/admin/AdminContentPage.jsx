import { useEffect, useState } from 'react'
import { adminApi, getApiError, getPublicBlogDocumentFileUrl, getPublicFileUrl } from '../../lib/api'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

const DEFAULT_FORM = {
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
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
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
  whatsappUrl: 'https://wa.me/254700000000',
  linkedinUrl: 'https://www.linkedin.com/in/kelvin-simiyu-b04244354',
  githubUrl: 'https://github.com/kelvin-simiyu',
  tiktokUrl: 'https://www.tiktok.com/@kelly.the.money.m',
  resumeOriginalName: '',
  resumeStoredName: '',
  resumeVisible: false,
  resumeDownloadEnabled: false,
  cvOriginalName: '',
  cvStoredName: '',
  cvVisible: false,
  cvDownloadEnabled: false,
}

function TextInput({ label, name, value, onChange, placeholder = '', type = 'text' }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">{label}</span>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none ring-cyan-300/40 focus:ring"
      />
    </label>
  )
}

function TextArea({ label, name, value, onChange, rows = 3 }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">{label}</span>
      <textarea
        name={name}
        value={value || ''}
        onChange={onChange}
        rows={rows}
        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none ring-cyan-300/40 focus:ring"
      />
    </label>
  )
}

function FileUploadCard({
  title,
  type,
  fileName,
  hasFile,
  downloadEnabled,
  busy,
  onUpload,
  onDelete,
  onToggle,
}) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-xs text-slate-300">{fileName || 'No file uploaded yet.'}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <label className="cursor-pointer rounded-lg border border-cyan-200/45 bg-cyan-300/20 px-3 py-2 text-xs font-semibold text-cyan-50">
          {busy ? 'Uploading...' : `Upload ${title}`}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) {
                onUpload(type, file)
              }
              event.target.value = ''
            }}
          />
        </label>

        {hasFile ? (
          <a
            href={`${getPublicFileUrl(type)}?download=true`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100"
          >
            Test Download
          </a>
        ) : null}

        {hasFile ? (
          <a
            href={`${getPublicFileUrl(type)}?download=false`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100"
          >
            Test Read
          </a>
        ) : null}

        {hasFile ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onDelete(type)}
            className="rounded-lg border border-rose-300/45 bg-rose-300/15 px-3 py-2 text-xs font-semibold text-rose-200 disabled:opacity-60"
          >
            Delete
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid gap-2">
        <label className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-200">
          <input
            type="checkbox"
            name={type === 'resume' ? 'resumeDownloadEnabled' : 'cvDownloadEnabled'}
            checked={Boolean(downloadEnabled)}
            disabled={!hasFile || busy}
            onChange={onToggle}
          />
          Allow Download
        </label>
      </div>
    </div>
  )
}

export default function AdminContentPage() {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [blogDocuments, setBlogDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingType, setUploadingType] = useState('')
  const [uploadingBlog, setUploadingBlog] = useState(false)
  const [busyBlogId, setBusyBlogId] = useState(null)
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [notice, setNotice] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: '' })
  const [blogDeleteDialog, setBlogDeleteDialog] = useState({ isOpen: false, id: null })

  const loadContent = async () => {
    const [contentData, blogData] = await Promise.all([
      adminApi.getContent(),
      adminApi.listBlogDocuments(),
    ])
    setForm({ ...DEFAULT_FORM, ...(contentData || {}) })
    setBlogDocuments(Array.isArray(blogData) ? blogData : [])
  }

  useEffect(() => {
    setLoading(true)
    loadContent()
      .catch((error) => {
        setNotice({ type: 'error', text: getApiError(error) })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const onChange = (event) => {
    const { name, type, value, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setNotice(null)

    try {
      const saved = await adminApi.updateContent(form)
      setForm({ ...DEFAULT_FORM, ...saved })
      setNotice({ type: 'success', text: 'Content updated successfully.' })
    } catch (error) {
      setNotice({ type: 'error', text: getApiError(error) })
    } finally {
      setSaving(false)
    }
  }

  const uploadFile = async (type, file) => {
    setUploadingType(type)
    setNotice(null)

    try {
      await adminApi.uploadContentFile(type, file)
      await loadContent()
      setNotice({ type: 'success', text: `${type.toUpperCase()} uploaded successfully.` })
    } catch (error) {
      setNotice({ type: 'error', text: getApiError(error) })
    } finally {
      setUploadingType('')
    }
  }

  const deleteFile = async (type) => {
    setConfirmDialog({ isOpen: true, type })
  }

  const confirmDeleteFile = async () => {
    const type = confirmDialog.type
    setConfirmDialog({ isOpen: false, type: '' })
    setUploadingType(type)
    setNotice(null)
    try {
      await adminApi.deleteContentFile(type)
      await loadContent()
      setNotice({ type: 'success', text: `${type.toUpperCase()} deleted successfully.` })
    } catch (error) {
      setNotice({ type: 'error', text: getApiError(error) })
    } finally {
      setUploadingType('')
    }
  }

  const uploadBlogDocument = async (file) => {
    if (!file) return
    setUploadingBlog(true)
    setNotice(null)
    try {
      await adminApi.createBlogDocument({ title: newBlogTitle, file })
      setNewBlogTitle('')
      await loadContent()
      setNotice({ type: 'success', text: 'Blog document uploaded successfully.' })
    } catch (error) {
      setNotice({ type: 'error', text: getApiError(error) })
    } finally {
      setUploadingBlog(false)
    }
  }

  const onBlogDocumentChange = (id, field, value) => {
    setBlogDocuments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    )
  }

  const saveBlogDocument = async (document) => {
    const id = document?.id
    if (!id) return
    const normalizedTitle = (document.title || '').trim() || document.originalName || 'Document'
    setBusyBlogId(id)
    setNotice(null)
    try {
      await adminApi.updateBlogDocument(id, {
        title: normalizedTitle,
        visible: Boolean(document.visible),
        downloadEnabled: Boolean(document.downloadEnabled),
        displayOrder: Number(document.displayOrder) >= 0 ? Number(document.displayOrder) : 0,
      })
      await loadContent()
      setNotice({ type: 'success', text: 'Blog document updated successfully.' })
    } catch (error) {
      setNotice({ type: 'error', text: getApiError(error) })
    } finally {
      setBusyBlogId(null)
    }
  }

  const openDeleteBlogDialog = (id) => {
    setBlogDeleteDialog({ isOpen: true, id })
  }

  const confirmDeleteBlogDocument = async () => {
    const id = blogDeleteDialog.id
    setBlogDeleteDialog({ isOpen: false, id: null })
    if (!id) return
    setBusyBlogId(id)
    setNotice(null)
    try {
      await adminApi.deleteBlogDocument(id)
      await loadContent()
      setNotice({ type: 'success', text: 'Blog document deleted successfully.' })
    } catch (error) {
      setNotice({ type: 'error', text: getApiError(error) })
    } finally {
      setBusyBlogId(null)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Content Settings</h2>
        <p className="text-sm text-slate-300">Manage all visible homepage text, labels, stats, profile image and contact links.</p>
      </div>

      {notice ? (
        <p className={`text-sm ${notice.type === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}>
          {notice.text}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-300">Loading content...</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <h3 className="mb-3 text-lg font-semibold">Resume / CV Files</h3>
            <p className="mb-4 text-sm text-slate-300">Upload files (PDF, DOC, DOCX). They are readable in Blog Docs; downloads are controlled by the Allow Download toggle.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <FileUploadCard
                title="Resume"
                type="resume"
                fileName={form.resumeOriginalName}
                hasFile={Boolean(form.resumeStoredName)}
                downloadEnabled={form.resumeDownloadEnabled}
                busy={uploadingType === 'resume'}
                onUpload={uploadFile}
                onDelete={deleteFile}
                onToggle={onChange}
              />
              <FileUploadCard
                title="CV"
                type="cv"
                fileName={form.cvOriginalName}
                hasFile={Boolean(form.cvStoredName)}
                downloadEnabled={form.cvDownloadEnabled}
                busy={uploadingType === 'cv'}
                onUpload={uploadFile}
                onDelete={deleteFile}
                onToggle={onChange}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <h3 className="mb-3 text-lg font-semibold">Additional Blog Documents</h3>
            <p className="mb-4 text-sm text-slate-300">Add as many documents as you need for the Blog Docs section.</p>

            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                value={newBlogTitle}
                onChange={(event) => setNewBlogTitle(event.target.value)}
                placeholder="Document title (optional)"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none ring-cyan-300/40 focus:ring"
              />
              <label className="cursor-pointer rounded-lg border border-cyan-200/45 bg-cyan-300/20 px-4 py-2.5 text-sm font-semibold text-cyan-50">
                {uploadingBlog ? 'Uploading...' : 'Upload Document'}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  disabled={uploadingBlog}
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) {
                      uploadBlogDocument(file)
                    }
                    event.target.value = ''
                  }}
                />
              </label>
            </div>

            {blogDocuments.length === 0 ? (
              <p className="text-sm text-slate-300">No additional blog documents uploaded yet.</p>
            ) : (
              <div className="space-y-3">
                {blogDocuments.map((doc) => (
                  <div key={doc.id} className="rounded-xl border border-white/15 bg-white/5 p-4">
                    <div className="grid gap-3 md:grid-cols-12">
                      <div className="md:col-span-5">
                        <label className="block space-y-1">
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">Title</span>
                          <input
                            type="text"
                            value={doc.title || ''}
                            onChange={(event) => onBlogDocumentChange(doc.id, 'title', event.target.value)}
                            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none ring-cyan-300/40 focus:ring"
                          />
                        </label>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block space-y-1">
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">Order</span>
                          <input
                            type="number"
                            min="0"
                            value={doc.displayOrder ?? 0}
                            onChange={(event) => onBlogDocumentChange(doc.id, 'displayOrder', event.target.value)}
                            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm outline-none ring-cyan-300/40 focus:ring"
                          />
                        </label>
                      </div>

                      <div className="md:col-span-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">File</p>
                        <p className="mt-1 text-sm text-slate-200">{doc.originalName}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <a
                            href={`${getPublicBlogDocumentFileUrl(doc.id)}?download=false`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100"
                          >
                            Test Read
                          </a>
                          {doc.downloadEnabled ? (
                            <a
                              href={`${getPublicBlogDocumentFileUrl(doc.id)}?download=true`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100"
                            >
                              Test Download
                            </a>
                          ) : (
                            <span className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-300">
                              Download disabled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-200">
                        <input
                          type="checkbox"
                          checked={Boolean(doc.visible)}
                          onChange={(event) => onBlogDocumentChange(doc.id, 'visible', event.target.checked)}
                        />
                        Visible
                      </label>
                      <label className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-200">
                        <input
                          type="checkbox"
                          checked={Boolean(doc.downloadEnabled)}
                          onChange={(event) => onBlogDocumentChange(doc.id, 'downloadEnabled', event.target.checked)}
                        />
                        Allow Download
                      </label>
                      <button
                        type="button"
                        disabled={busyBlogId === doc.id}
                        onClick={() => saveBlogDocument(doc)}
                        className="rounded-lg border border-cyan-200/45 bg-cyan-300/20 px-3 py-2 text-xs font-semibold text-cyan-50 disabled:opacity-60"
                      >
                        {busyBlogId === doc.id ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        disabled={busyBlogId === doc.id}
                        onClick={() => openDeleteBlogDialog(doc.id)}
                        className="rounded-lg border border-rose-300/45 bg-rose-300/15 px-3 py-2 text-xs font-semibold text-rose-200 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Brand Name" name="brandName" value={form.brandName} onChange={onChange} />
            <TextInput label="Nav CTA Text" name="navHireCtaText" value={form.navHireCtaText} onChange={onChange} />
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <h3 className="mb-3 text-lg font-semibold">Hero</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Hero Title" name="heroTitle" value={form.heroTitle} onChange={onChange} />
              <TextInput label="Hero Highlight" name="heroHighlight" value={form.heroHighlight} onChange={onChange} />
              <TextInput label="Hero Tag One" name="heroTagOne" value={form.heroTagOne} onChange={onChange} />
              <TextInput label="Hero Tag Two" name="heroTagTwo" value={form.heroTagTwo} onChange={onChange} />
              <TextInput label="Hero Tag Three" name="heroTagThree" value={form.heroTagThree} onChange={onChange} />
              <TextInput label="Profile Image URL" name="profileImageUrl" value={form.profileImageUrl} onChange={onChange} />
              <TextInput label="Primary CTA Text" name="heroPrimaryCtaText" value={form.heroPrimaryCtaText} onChange={onChange} />
              <TextInput label="Primary CTA Link" name="heroPrimaryCtaLink" value={form.heroPrimaryCtaLink} onChange={onChange} />
              <TextInput label="Secondary CTA Text" name="heroSecondaryCtaText" value={form.heroSecondaryCtaText} onChange={onChange} />
              <TextInput label="Secondary CTA Link" name="heroSecondaryCtaLink" value={form.heroSecondaryCtaLink} onChange={onChange} />
            </div>
            <div className="mt-4">
              <TextInput label="Hero Subheadline" name="heroSubheadline" value={form.heroSubheadline} onChange={onChange} />
            </div>
            <div className="mt-4">
              <TextArea label="Hero Description" name="heroDescription" value={form.heroDescription} onChange={onChange} rows={4} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <h3 className="mb-3 text-lg font-semibold">About + Stats</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="About Title" name="aboutTitle" value={form.aboutTitle} onChange={onChange} />
            </div>
            <div className="mt-4">
              <TextArea label="About Description" name="aboutDescription" value={form.aboutDescription} onChange={onChange} rows={3} />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <TextInput label="Stat 1 Value" name="statOneValue" value={form.statOneValue} onChange={onChange} />
              <TextInput label="Stat 2 Value" name="statTwoValue" value={form.statTwoValue} onChange={onChange} />
              <TextInput label="Stat 3 Value" name="statThreeValue" value={form.statThreeValue} onChange={onChange} />
              <TextInput label="Stat 1 Label" name="statOneLabel" value={form.statOneLabel} onChange={onChange} />
              <TextInput label="Stat 2 Label" name="statTwoLabel" value={form.statTwoLabel} onChange={onChange} />
              <TextInput label="Stat 3 Label" name="statThreeLabel" value={form.statThreeLabel} onChange={onChange} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <h3 className="mb-3 text-lg font-semibold">Section Titles + Contact</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Services Title" name="servicesTitle" value={form.servicesTitle} onChange={onChange} />
              <TextInput label="Work Title" name="workTitle" value={form.workTitle} onChange={onChange} />
              <TextInput label="Skills Title" name="skillsTitle" value={form.skillsTitle} onChange={onChange} />
              <TextInput label="Testimonials Title" name="testimonialsTitle" value={form.testimonialsTitle} onChange={onChange} />
              <TextInput label="Videos Title" name="videosTitle" value={form.videosTitle} onChange={onChange} />
              <TextInput label="Contact Title" name="contactTitle" value={form.contactTitle} onChange={onChange} />
              <TextInput label="Contact Card Title" name="contactCardTitle" value={form.contactCardTitle} onChange={onChange} />
              <TextInput label="Contact Email" name="contactEmail" value={form.contactEmail} onChange={onChange} type="email" />
              <TextInput label="WhatsApp URL" name="whatsappUrl" value={form.whatsappUrl} onChange={onChange} />
              <TextInput label="LinkedIn URL" name="linkedinUrl" value={form.linkedinUrl} onChange={onChange} />
              <TextInput label="GitHub URL" name="githubUrl" value={form.githubUrl} onChange={onChange} />
              <TextInput label="TikTok URL" name="tiktokUrl" value={form.tiktokUrl} onChange={onChange} />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full border border-cyan-200/45 bg-cyan-300/20 px-6 py-2.5 text-sm font-semibold text-cyan-50 disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Content'}
            </button>
          </div>
        </form>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete File"
        message={`Are you sure you want to delete this ${confirmDialog.type?.toUpperCase()} file? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={uploadingType === confirmDialog.type}
        onConfirm={confirmDeleteFile}
        onCancel={() => setConfirmDialog({ isOpen: false, type: '' })}
      />
      <ConfirmDialog
        isOpen={blogDeleteDialog.isOpen}
        title="Delete Blog Document"
        message="Are you sure you want to delete this blog document? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={busyBlogId === blogDeleteDialog.id}
        onConfirm={confirmDeleteBlogDocument}
        onCancel={() => setBlogDeleteDialog({ isOpen: false, id: null })}
      />
    </div>
  )
}
