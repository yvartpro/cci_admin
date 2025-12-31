import { useEffect, useState } from 'react'
import { uploadFiles, uploadArticleFiles, uploadLibraryFiles, getArticles } from '../services/api'
import { saveMediaEntry } from '../services/mediaStore'

const MediaUploader = ({ onUploaded, articleId }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState({}) // key: file name -> percent

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
    if (uploadedEntries.length) onUploaded && onUploaded(uploadedEntries)
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


  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2">Upload media</label>
      <input type="file" multiple onChange={e => handleFiles(e.target.files)} className="mb-2" />
      {loading && <div className="text-sm text-gray-500">Uploading...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="mt-3 space-y-2">
        {Object.keys(progress).map(name => (
          <div key={name} className="text-xs">
            <div className="flex items-center justify-between"><span>{name}</span><span>{progress[name]}%</span></div>
            <div className="w-full bg-gray-200 h-2 rounded mt-1"><div style={{ width: progress[name] + '%'}} className="bg-indigo-600 h-2 rounded"/></div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default MediaUploader
