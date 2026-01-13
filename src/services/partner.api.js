import apiClient from "./apiClient"

export const getPartners = async () => {
    const { data } = await apiClient.get("/partner")
    return data
}

export const getPartnerById = async (id) => {
    const { data } = await apiClient.get(`/partner/${id}`)
    return data
}

export const createPartner = async (payload) => {
    const { data } = await apiClient.post("/partner", payload)
    return data
}

export const updatePartner = async (id, payload) => {
    const { data } = await apiClient.patch(`/partner/${id}`, payload)
    return data
}

export const deletePartner = async (id) => {
    const { data } = await apiClient.delete(`/partner/${id}`)
    return data
}

export const uploadPartnerFiles = async (partnerId, formData, config = {}) => {
    const { data } = await apiClient.post(
        `/partner/${partnerId}/files`,
        formData,
        { ...config }
    )
    return data
}
