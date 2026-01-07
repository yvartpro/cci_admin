import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

export const getArticles = () =>
  api.get("/articles").then(res => res.data).catch(err => { throw err });

export const getArticleById = (id) =>
  api.get(`/articles/${id}`).then(res => res.data).catch(err => { throw err });

export const createArticle = (data) =>
  api.post("/articles", data).then(res => res.data).then(data => console.log("Created article:", data)).catch(err => { throw err });

export const updateArticle = (id, data) =>
  api.patch(`/articles/${id}`, data).then(res => res.data).catch(err => { throw err });

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

export const deleteFile = (id) =>
  api.delete(`/files/${id}`).then(res => res.data).catch(err => { throw err });

// Volunteer API functions
export const getVolunteers = () =>
  api.get("/volunteers").then(res => res.data).catch(err => { throw err });

export const getVolunteerById = (id) =>
  api.get(`/volunteers/${id}`).then(res => res.data).catch(err => { throw err });

export const createVolunteer = (data) =>
  api.post("/volunteers", data).then(res => res.data).catch(err => { throw err });

export const updateVolunteer = (id, data) =>
  api.patch(`/volunteers/${id}`, data).then(res => res.data).catch(err => { throw err });

export const deleteVolunteer = (id) =>
  api.delete(`/volunteers/${id}`).then(res => res.data).catch(err => { throw err });

export const uploadVolunteerFiles = (volunteerId, formData, config = {}) =>
  api.post(`/volunteers/${volunteerId}/files`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, ...config })
    .then(res => res.data)
    .catch(err => { throw err });
