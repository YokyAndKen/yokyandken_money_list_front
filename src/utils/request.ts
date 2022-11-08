import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCookie, removeCookie } from './cookie'

const DEVELOPMENT = 'development'
const DEBUG = 'debug'
const PRODUCTION = 'production'
let baseUrl = '/', router = useRouter()

// if (process.env.NODE_ENV === DEVELOPMENT) {
//  baseUrl = '/'
//} else if (process.env.NODE_ENV === DEBUG) {
//  baseUrl = 'www.baidu.com2'
//} else if (process.env.NODE_ENV === PRODUCTION) {
//  baseUrl = 'www.baidu.com3'
//}

const service = axios.create({
  baseURL: baseUrl,
  timeout: 100 * 1000,
  headers: {'Content-Type': 'application/json'}
})
// axios.defaults.baseURL = baseUrl
// axios.defaults.timeout = 10 * 1000
// // post 请求时，加上请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

axios.interceptors.request.use(
  config => {
    // token的验证逻辑，若无，跳转至登录页面，若有，请求头带上到后台验证，以防token过期，如已过期（需在响应拦截器处理然后去登录）
    const token = getCookie('token')
    token && (config.headers.Authorization = token)
    !token && router.push('/login')
    return config
  },
  error => {
    return Promise.error(error)
  }
)

axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 401: // 未登录
          ElMessage.error(error.response.data.message)
          router.push({path: '/login'})
          break
        case 403:  // 登录过期，清除token后，跳转到login页面
          ElMessage.error(error.response.data.message)
          Cookies.removeCookie('token')
          router.push({path: '/login'})
          break
        default: // 全局返回接口信息的返回错误
          ElMessage.error(error.response.data.message)
          break
      }
    }
    return Promise.reject(error.response)
  }
)

export default service