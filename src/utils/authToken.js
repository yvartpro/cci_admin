export const getAuthToken = () => localStorage.getItem("token")

export const setAuthToken = (token) =>
    localStorage.setItem("token", token)

export const clearAuthToken = () =>
    localStorage.removeItem("token")
