import apiClient from "./apiClient"

export const getComitards = async () => {
    const { data } = await apiClient.get("/comitard")
    return data
}

export const getComitardById = async (id) => {
    const { data } = await apiClient.get(`/comitard/${id}`)
    return data
}

export const createComitard = async (payload) => {
    const { data } = await apiClient.post("/comitard", payload)
    return data
}

export const updateComitard = async (id, payload) => {
    const { data } = await apiClient.patch(`/comitard/${id}`, payload)
    return data
}

export const deleteComitard = async (id) => {
    const { data } = await apiClient.delete(`/comitard/${id}`)
    return data
}

export const uploadComitardFiles = async (comitardId, formData, config = {}) => {
    const { data } = await apiClient.post(
        `/comitard/${comitardId}/files`,
        formData,
        { ...config }
    )
    return data
}
