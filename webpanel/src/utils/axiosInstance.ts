import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
})

export const cerberusAxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_CERBERUS_API_BASE_URL,
  withCredentials: true,
})

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    if (error.response && error.response.status === 401) {
      window.location.href = `${window.location.origin}/login`
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)
