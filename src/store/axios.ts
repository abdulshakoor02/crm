import axios from 'axios'

export interface ResponseGenerator {
  config?: any
  data?: any
  headers?: any
  request?: any
  status?: number
  statusText?: string
}

const instance = axios.create({})

instance.interceptors.request.use(
  async (request: any) => {
    const token = window.localStorage.getItem('accessToken');
    console.log("token ", token)
    if (token) {
      request.headers['token'] = token; // Using 'token' as key
    }
    return request
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default instance
