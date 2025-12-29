import { useState } from 'react'
import { uploadFiles } from '../services/api'
import { saveMediaEntry } from '../services/mediaStore'

const MediaUploader = ({ onUploaded }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFiles = (files) => {
    const list = Array.from(files || [])
    if (!list.length) return
    setLoading(true)
    setError(null)

    // Try to upload to server; if fails, fall back to local object URLs
    const fd = new FormData()
    list.forEach(f => fd.append('files', f))
    uploadFiles(fd).then(res => {
      // res.urls expected - create separate entry per URL
      const type = list[0].type.startsWith('image') ? 'image' : 'video'
      const entries = res.urls.map(url => ({ id: crypto.randomUUID(), type, urls: [url], createdAt: new Date().toISOString() }))
      Promise.all(entries.map(e => saveMediaEntry(e))).then(() => onUploaded && onUploaded(entries)).finally(() => setLoading(false))
    }).catch(() => {
      const urls = list.map(f => ({ name: f.name, url: URL.createObjectURL(f) }))
      const type = list[0].type.startsWith('image') ? 'image' : 'video'
      const entries = urls.map(u => ({ id: crypto.randomUUID(), type, urls: [u.url], localNames: [u.name], createdAt: new Date().toISOString(), local: true }))
      Promise.all(entries.map(e => saveMediaEntry(e))).then(() => onUploaded && onUploaded(entries)).finally(() => setLoading(false))
    })
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2">Upload media</label>
      <input type="file" multiple onChange={e => handleFiles(e.target.files)} className="mb-2" />
      {loading && <div className="text-sm text-gray-500">Uploading...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  )
}

export default MediaUploader
