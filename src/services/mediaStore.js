const KEY = 'cci_admin_media_v1'

const read = () => {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

const write = (items) => localStorage.setItem(KEY, JSON.stringify(items))

export const listMedia = () => Promise.resolve(read())

export const saveMediaEntry = (entry) => {
  const items = read()
  items.unshift(entry)
  write(items)
  return Promise.resolve(entry)
}

export const deleteMediaEntry = (id) => {
  const items = read().filter(i => i.id !== id)
  write(items)
  return Promise.resolve()
}

export const clearMedia = () => {
  write([])
  return Promise.resolve()
}

export default { listMedia, saveMediaEntry, deleteMediaEntry, clearMedia }
