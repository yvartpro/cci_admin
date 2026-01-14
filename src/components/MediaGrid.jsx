import { useEffect, useState } from 'react'
import { listMedia, deleteMediaEntry } from '../services/mediaStore'
import { getFiles, patchFile } from '../services/files.api'
import { LoadingSpinner } from './LoadingSpinner'

const MediaGrid = ({ onSelect, refreshKey }) => {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      setLoading(true)
      const files = await getFiles()
      const serverItems = files.map(s => ({
        id: String(s.id),
        type: (s.mime || '').startsWith('image') ? 'image' : 'video',
        url: s.url,
        urls: [s.url],
        filename: s.filename,
        optimized: !!s.optimized,
        use_as: s.use_as || ''
      }))
      setItems(serverItems)
    } catch (err) {
      console.error(err)
      listMedia().then(setItems)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])
  // reload when refreshKey changes (triggered after uploads)
  useEffect(() => { load() }, [refreshKey])

  const toggle = (id) => {
    setSelected(prev => {
      const nw = new Set(prev)
      if (nw.has(id)) nw.delete(id); else nw.add(id)
      return nw
    })
  }

  const insertSelected = () => {
    const chosen = items.filter(i => selected.has(i.id))
    if (chosen.length && onSelect) onSelect(chosen)
  }

  return loading ? <LoadingSpinner txt="media" /> : (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {false && <button onClick={insertSelected} className="bg-indigo-600 text-white px-3 py-1 rounded text-sm">Insert Selected</button>}
        <button onClick={load} className="bg-gray-100 px-3 py-1 rounded text-sm">Refresh</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(m => (
          <div key={m.id} className="relative border rounded overflow-hidden bg-white">
            <div className="absolute top-2 left-2 z-10">
              <input type="checkbox" checked={selected.has(m.id)} onChange={() => toggle(m.id)} />
            </div>
            <div className="h-36 bg-gray-100 flex items-center justify-center">
              {m.type === 'image' ? (
                <img
                  src={m.url || (m.urls && m.urls[0])}
                  alt={m.url || 'media'}
                  className="object-cover w-full h-full"
                  onError={(e) => { console.error('img load error', m, e); e.currentTarget.style.opacity = 0.4 }}
                />
              ) : (
                <video src={m.url || (m.urls && m.urls[0])} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="p-2 border-t">
              <select
                value={m.use_as}
                onChange={(e) => patchFile(m.id, { use_as: e.target.value || null }).then(load).catch(err => console.error(err))}
                className="w-full text-[10px] bg-gray-50 border rounded px-1 py-0.5"
              >
                <option value="">-- Utiliser comme --</option>
                <option value="hero">Hero (Accueil)</option>
                <option value="presentation">Présentation</option>
                <option value="volunteer">Volontaires</option>
                <option value="social">Social</option>
                <option value="lastar">LaSTAR</option>
                <option value="invest">Invest</option>
                <option value="activities">Activities</option>
                <option value="contact">Contact</option>
                <option value="news">News</option>
              </select>
            </div>
            <div className="p-2 flex items-center justify-between text-xs">
              <button onClick={() => onSelect && onSelect([m])} className="text-indigo-600">Select</button>
              <button onClick={() => deleteMediaEntry(m.id).then(load)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {!items.length && <div className="text-sm text-gray-500 mt-4">No media yet</div>}
    </div>
  )
}

export default MediaGrid
