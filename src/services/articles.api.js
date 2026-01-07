import apiClient from "./apiClient"

export const getArticles = async () => {
    const { data } = await apiClient.get("/articles")
    return data
}

export const getArticleById = async (id) => {
    const { data } = await apiClient.get(`/articles/${id}`)
    return data
}

export const createArticle = async (payload) => {
    const { data } = await apiClient.post("/articles", payload)
    return data
}

export const updateArticle = async (id, payload) => {
    const { data } = await apiClient.patch(`/articles/${id}`, payload)
    return data
}

export const deleteArticle = async (id) => {
    const { data } = await apiClient.delete(`/articles/${id}`)
    return data
}

export const uploadArticleFiles = async (articleId, formData, config = {}) => {
    const { data } = await apiClient.post(
        `/articles/${articleId}/files`,
        formData,
        { ...config }
    )
    return data
}
