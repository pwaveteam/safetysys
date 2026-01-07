import axios from 'axios'
import { useLoadingStore } from '@/stores/loadingStore'

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
})

let activeRequests = 0

export const setupAxiosInterceptors = () => {
  const { setLoading } = useLoadingStore.getState()

  axiosInstance.interceptors.request.use(
    (config) => {
      activeRequests++
      if (activeRequests === 1) {
        setLoading(true)
      }
      return config
    },
    (error) => {
      activeRequests--
      if (activeRequests === 0) {
        setLoading(false)
      }
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(
    (response) => {
      activeRequests--
      if (activeRequests === 0) {
        setLoading(false)
      }
      return response
    },
    (error) => {
      activeRequests--
      if (activeRequests === 0) {
        setLoading(false)
      }
      return Promise.reject(error)
    }
  )
}