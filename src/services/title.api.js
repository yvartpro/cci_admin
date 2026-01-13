import apiClient from "./apiClient"

export const getTitles = async () => {
    const { data } = await apiClient.get("/titre")
    return data
}

export const getTitleById = async (id) => {
    const { data } = await apiClient.get(`/titre/${id}`)
    return data
}

export const createTitle = async (payload) => {
    const { data } = await apiClient.post("/titre", payload)
    return data
}

export const updateTitle = async (id, payload) => {
    const { data } = await apiClient.patch(`/titre/${id}`, payload)
    return data
}

export const deleteTitle = async (id) => {
    const { data } = await apiClient.delete(`/titre/${id}`)
    return data
}

export const uploadTitleFiles = async (titleId, formData, config = {}) => {
    const { data } = await apiClient.post(
        `/titre/${titleId}/files`,
        formData,
        { ...config }
    )
    return data
}
