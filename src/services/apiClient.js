import axios from "axios"
import { getAuthToken, clearAuthToken } from "../utils/authToken"

const apiClient = axios.create({
  baseURL: "https://capbio.bi/cci/api",
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken()
    }

    return Promise.reject({
      status: error.response?.status,
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Unexpected error",
    })
  }
)

export default apiClient
