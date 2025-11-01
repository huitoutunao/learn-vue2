import QS from 'qs'
import { Notification } from 'element-ui'
import store from '@/store'
import router from '@/router'
import Request from './axios'

export const requestor = new Request({
  timeout: 60000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  transformRequest: [
    data => {
      return QS.stringify(data)
    },
  ],
  interceptors: {
    // 请求拦截器
    handleRequest: config => {
      // console.log('实例请求拦截器', config)
      const cfg = config
      const token = store.state.adminPcModule.loginToken
      cfg.data = {
        ...config.data,
        token,
      }
      cfg.transitional.clarifyTimeoutError = true

      return cfg
    },

    // 响应拦截器
    handleResponse: response => {
      // console.log('实例响应拦截器', response)
      if (response.data.info === '该用户未登录或已在其他系统登录或长时间未操作！') {
        Notification({
          title: '错误',
          message: response.data.info,
          type: 'error',
        })
        store.commit('adminPcModule/changeLoginToken', '')
        router.replace('/admin-login').catch(() => {})
        return Promise.reject(response)
      }
      return response
    },

    // 错误处理器
    handleError: error => {
      console.log('handleError', error)
      const errData = {
        errOrg: error, // 异常源数据
        errState: 0, // 自定义状态码
        errStatus: error.request.status, // 接口状态码
        errInfo: `${error.request.status}:请求异常`, // 异常提示语
      }
      const custom = (error && error.config && error.config.custom) || ''

      let isToast = true
      if (custom.isToast === false) {
        isToast = false
      } else {
        isToast = true
      }

      if (error.code === 'ETIMEDOUT' || error.message.indexOf('timeout') !== -1) {
        errData.errState = -1
        errData.errInfo = '请求超时'
        if (isToast) {
          Notification({
            title: '错误',
            message: '请求超时',
            type: 'error',
            duration: 3500,
          })
        }
        return Promise.reject(errData)
      }
      if (error.code === 'ERR_CANCELED') {
        errData.errState = -3
        errData.errInfo = '取消请求'
        // if (isToast) {
        //   Toast('取消请求')
        // }
        return Promise.reject(errData)
      }
      if (error.code === 'ERR_NETWORK') {
        errData.errState = -2
        errData.errInfo = '当前网络环境异常'
        if (isToast) {
          Notification({
            title: '错误',
            message: '当前网络环境异常',
            type: 'error',
            duration: 3500,
          })
        }
        // return Promise.reject(errData)
      } else {
        // 2024-01：后面接口服务通用捕获异常
        errData.errState = -4
        if (isToast && typeof errData.errStatus !== 'undefined') {
          Notification({
            title: '错误',
            message: `${errData.errStatus}:请求${error?.config?.url ?? ''}数据失败`,
            type: 'error',
            duration: 3500,
          })
        }
      }

      return Promise.reject(errData)
    },
  },
})

export const cancelAllRequest = () => {
  return requestor.cancelAllRequest()
}

export const cancelRequest = url => {
  return requestor.cancelRequest(url)
}
