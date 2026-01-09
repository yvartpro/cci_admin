import { useEffect, useState, useRef } from 'react'
import { UploadCloud } from 'lucide-react'
import { getArticles, uploadArticleFiles } from '../services/articles.api'
import { uploadLibraryFiles } from '../services/files.api'
import { saveMediaEntry } from '../services/mediaStore'

const MediaUploader = ({ onUploaded, articleId }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState({}) // key: file name -> percent
  const fileInputRef = useRef(null)

  useEffect(() => {
    getArticles().catch((err) => console.warn('failed to pre-load articles', err.message || err))
  }, [])

  const handleFiles = async (files) => {
    const list = Array.from(files || [])
    if (!list.length) return
    setLoading(true)
    setError(null)
    setProgress({})

    // Upload files sequentially so we can show per-file progress
    const uploadedEntries = []
    for (const f of list) {
      const fd = new FormData()
      fd.append('files', f)
      try {
        const uploadFn = articleId ? (fd, cfg) => uploadArticleFiles(articleId, fd, cfg) : (fd, cfg) => uploadLibraryFiles(fd, cfg)
        const res = await uploadFn(fd, {
          onUploadProgress: (e) => {
            const pct = e.total ? Math.round((e.loaded / e.total) * 100) : 0
            setProgress(prev => ({ ...prev, [f.name]: pct }))
          }
        })

        // prefer detailed info; also accept `files` (library endpoint) or `urls`
        console.log('upload response', res)
        const info = (res && Array.isArray(res.details) && res.details[0])
          || (res && Array.isArray(res.files) && res.files[0])
          || (res && Array.isArray(res.urls) && { url: res.urls[0] })
          || null
        if (!info) {
          setError('Upload succeeded but server returned no file info')
          // stop further uploads
          break
        }
        const type = f.type.startsWith('image') ? 'image' : 'video'
        const entry = { id: crypto.randomUUID(), type, urls: [info.url], filename: info.filename || f.name, optimized: !!info.optimized, createdAt: new Date().toISOString(), server: true }
        // persist so MediaGrid can show it
        await saveMediaEntry(entry)
        uploadedEntries.push(entry)
      } catch (err) {
        console.error('upload error', err)
        setError(err?.message || 'Upload failed')
        // stop uploading remaining files on error
        break
      }
    }

    // finished
    setLoading(false)
    if (uploadedEntries.length) {
      if (fileInputRef.current) fileInputRef.current.value = ''
      setProgress({})
      onUploaded && onUploaded(uploadedEntries)
    }
  }

  // helper to fallback to data-URL previews
  const fallbackToDataURLs = async (files, onUploadedCb) => {
    const readAsDataURL = (file) => new Promise((res, rej) => {
      const r = new FileReader()
      r.onload = () => res(r.result)
      r.onerror = rej
      r.readAsDataURL(file)
    })
    const type = files[0].type.startsWith('image') ? 'image' : 'video'
    const entries = await Promise.all(files.map(async (f) => {
      const data = await readAsDataURL(f)
      return { id: crypto.randomUUID(), type, urls: [data], localNames: [f.name], createdAt: new Date().toISOString(), local: true }
    }))
    await Promise.all(entries.map(e => saveMediaEntry(e)))
    onUploadedCb && onUploadedCb(entries)
  }


  const triggerUpload = () => fileInputRef.current?.click()

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h3 className="font-semibold text-gray-900 mb-4">Telecharger</h3>

      <div
        onClick={triggerUpload}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
      >
        <div className="bg-indigo-100 p-3 rounded-full mb-3 group-hover:bg-indigo-200 transition-colors">
          <UploadCloud size={24} className="text-indigo-600" />
        </div>
        <p className="text-sm font-medium text-gray-900">Cliquez pour telecharger</p>
        <p className="text-xs text-gray-500 mt-1">Images (PNG, JPG) ou Videos (MP4)</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
      {loading && <div className="text-sm text-gray-500">Uploading...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="mt-3 space-y-2">
        {Object.keys(progress).map(name => (
          <div key={name} className="text-xs">
            <div className="flex items-center justify-between"><span>{name}</span><span>{progress[name]}%</span></div>
            <div className="w-full bg-gray-200 h-2 rounded mt-1"><div style={{ width: progress[name] + '%' }} className="bg-indigo-600 h-2 rounded" /></div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default MediaUploader
