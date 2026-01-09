import apiClient from "./apiClient"

export const getFiles = async (params = {}) => {
    const { data } = await apiClient.get("/files", { params })
    return data
}

export const uploadLibraryFiles = async (formData, config = {}) => {
    const { data } = await apiClient.post("/files", formData, config)
    return data
}

export const deleteFile = async (id) => {
    const { data } = await apiClient.delete(`/files/${id}`)
    return data
}

export const patchFile = async (id, payload) => {
    const { data } = await apiClient.patch(`/files/${id}`, payload)
    return data
}
