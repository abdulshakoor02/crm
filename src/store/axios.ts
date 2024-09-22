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
    request.headers.token = window.localStorage.getItem('accessToken')

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
