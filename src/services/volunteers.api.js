import apiClient from "./apiClient"

export const getVolunteers = async () => {
    const { data } = await apiClient.get("/volunteers")
    return data
}

export const getVolunteerById = async (id) => {
    const { data } = await apiClient.get(`/volunteers/${id}`)
    return data
}

export const createVolunteer = async (payload) => {
    const { data } = await apiClient.post("/volunteers", payload)
    return data
}

export const updateVolunteer = async (id, payload) => {
    const { data } = await apiClient.patch(`/volunteers/${id}`, payload)
    return data
}

export const deleteVolunteer = async (id) => {
    const { data } = await apiClient.delete(`/volunteers/${id}`)
    return data
}

export const uploadVolunteerFiles = async (volunteerId, formData, config = {}) => {
    const { data } = await apiClient.post(
        `/volunteers/${volunteerId}/files`,
        formData,
        { ...config }
    )
    return data
}
