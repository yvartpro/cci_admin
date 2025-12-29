import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

export const getArticles = () => 
  api.get("/articles").then(res => res.data).catch(err => { throw err });

export const getArticleById = (id) => 
  api.get(`/articles/${id}`).then(res => res.data).catch(err => { throw err });

export const createArticle = (data) =>
  api.post("/articles", data).then(res => res.data).catch(err => { throw err });

export const updateArticle = (id, data) =>
  api.put(`/articles/${id}`, data).then(res => res.data).catch(err => { throw err });

export const deleteArticle = (id) =>
  api.delete(`/articles/${id}`).then(res => res.data).catch(err => { throw err });

export const uploadFiles = (formData) =>
  api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(res => res.data)
    .catch(err => { throw err })
    .finally(() => {});
