import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = {
  get: async (endpoint: string) => {
    const response = await axios.get(`${API_URL}${endpoint}`)
    return response.data
  },
  
  post: async (endpoint: string, data: any) => {
    const response = await axios.post(`${API_URL}${endpoint}`, data)
    return response.data
  },
  
  put: async (endpoint: string, data: any) => {
    const response = await axios.put(`${API_URL}${endpoint}`, data)
    return response.data
  },
  
  delete: async (endpoint: string) => {
    const response = await axios.delete(`${API_URL}${endpoint}`)
    return response.data
  },
}
