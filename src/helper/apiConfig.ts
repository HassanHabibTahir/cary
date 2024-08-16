import axios from 'axios'

const ApiAxios = axios.create({
  baseURL: import.meta.env.VITE_APP_SERVER_URL,
  headers: { 'Content-Type': 'application/json' },
})

const ignoredEndpoints = ['/auth/login', '/users'] // (/users is for signup)
const ignoredFrontendPaths = ['/login', '/signup', '/verify']

ApiAxios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const reqEndpoint = error?.config?.url
    if (
      error?.response?.status === 401 &&
      !ignoredEndpoints.includes(reqEndpoint) &&
      !ignoredFrontendPaths.includes(window.location.pathname)
    ) {
      localStorage.clear()
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export const apiAxios = ApiAxios

export const UploadAxios = axios.create({
  baseURL: import.meta.env.VITE_APP_SERVER_URL,
  headers: { 'Content-Type': 'multipart/form-data' },
})
