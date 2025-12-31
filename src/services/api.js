import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

export const getArticles = () => 
  api.get("/articles").then(res => res.data).catch(err => { throw err });

export const getArticleById = (id) => 
  api.get(`/articles/${id}`).then(res => res.data).catch(err => { throw err });

export const createArticle = (data) =>
  api.post("/articles", data).then(res => res.data).then(data => console.log("Created article:", data)).catch(err => { throw err });

export const updateArticle = (id, data) =>
  api.put(`/articles/${id}`, data).then(res => res.data).catch(err => { throw err });

export const deleteArticle = (id) =>
  api.delete(`/articles/${id}`).then(res => res.data).catch(err => { throw err });

export const uploadFiles = (formData, config = {}) =>
  api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }, ...config })
    .then(res => res.data)
    .catch(err => { throw err });

export const uploadArticleFiles = (articleId, formData, config = {}) =>
  api.post(`/articles/${articleId}/files`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, ...config })
    .then(res => res.data)
    .catch(err => { throw err });

export const uploadLibraryFiles = (formData, config = {}) =>
  api.post('/files', formData, { headers: { 'Content-Type': 'multipart/form-data' }, ...config })
    .then(res => res.data)
    .catch(err => { throw err });

export const getFiles = (params = {}) =>
  api.get('/files', { params }).then(res => res.data).catch(err => { throw err })
