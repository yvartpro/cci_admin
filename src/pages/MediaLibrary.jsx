import { useState } from 'react'
import MediaUploader from '../components/MediaUploader'
import MediaGrid from '../components/MediaGrid'
import { useNavigate } from 'react-router-dom'

const MediaLibrary = () => {
  const navigate = useNavigate()
  const [reloadKey, setReloadKey] = useState(0)

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Media Library</h1>
          <button onClick={() => navigate('/create')} className="bg-indigo-600 text-white px-3 py-1 rounded">Create Article</button>
        </div>

        <MediaUploader onUploaded={() => setReloadKey(k => k + 1)} />

        <div className="mt-6">
          <MediaGrid refreshKey={reloadKey} />
        </div>
      </div>
    </div>
  )
}

export default MediaLibrary
