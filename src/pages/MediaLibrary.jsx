import { useState } from 'react'
import MediaUploader from '../components/MediaUploader'
import MediaGrid from '../components/MediaGrid'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

const MediaLibrary = () => {
  const navigate = useNavigate()
  const [reloadKey, setReloadKey] = useState(0)

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gallerie photos</h1>
          <button onClick={() => navigate('/cci/create')} className="bg-indigo-600 inline-flex items-center gap-2 text-white px-3 py-1 rounded"><Plus size={18} /> Article</button>
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
