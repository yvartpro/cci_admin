import apiClient from "./apiClient"

export const getCarousels = async () => {
    const { data } = await apiClient.get("/carousel")
    return data
}

export const getCarouselById = async (id) => {
    const { data } = await apiClient.get(`/carousel/${id}`)
    return data
}

export const createCarousel = async (payload) => {
    const { data } = await apiClient.post("/carousel", payload)
    return data
}

export const updateCarousel = async (id, payload) => {
    const { data } = await apiClient.patch(`/carousel/${id}`, payload)
    return data
}

export const deleteCarousel = async (id) => {
    const { data } = await apiClient.delete(`/carousel/${id}`)
    return data
}

export const uploadCarouselFiles = async (carouselId, formData, config = {}) => {
    const { data } = await apiClient.post(
        `/carousel/${carouselId}/files`,
        formData,
        { ...config }
    )
    return data
}
