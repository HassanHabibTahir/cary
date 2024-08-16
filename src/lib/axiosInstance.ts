import axios, { AxiosInstance } from 'axios'

const baseURL = 'https://api.example.com'

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosInstance
