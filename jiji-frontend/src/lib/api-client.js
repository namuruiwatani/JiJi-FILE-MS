import axios from 'axios'
import { HOST } from '@/utils/constants'

const apiClient = axios.create({
  baseURL: HOST,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

export default apiClient
