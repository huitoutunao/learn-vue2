import axios from 'axios'
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import { get, hasIn, isObject, toString } from 'lodash-es'

class Request {
  constructor(config) {
    this.instance = axios.create(config)

    // 初始化存放取消请求控制器 Map
    this.abortControllerMap = new Map()
    this.interceptorsObj = config.interceptors

    /**
     * 拦截器执行顺序：
     * 实例请求 -> 全局请求 -> 实例响应 -> 全局响应
     */

    // 全局请求拦截器
    this.instance.interceptors.request.use(
      res => {
        if (!window.AbortController) {
          console.log('该浏览器不支持 AbortController API')
        }
        // console.log('全局请求拦截器', res)
        const controller = new AbortController()
        const url = res.url || ''
        res.signal = controller.signal

        const dataStr = isObject(res.data) ? JSON.stringify(res.data) : toString(res.data)

        this.abortControllerMap.set(`${url}?${dataStr}`, controller)

        return res
      },
      err => Promise.reject(err)
    )

    const handleRequest = get(this.interceptorsObj, 'handleRequest')
    const handleResponse = get(this.interceptorsObj, 'handleResponse')
    const handleError = get(this.interceptorsObj, 'handleError')

    // 实例请求拦截器
    this.instance.interceptors.request.use(handleRequest, handleError)

    // 实例响应拦截器
    this.instance.interceptors.response.use(handleResponse, handleError)

    // 全局响应拦截器
    this.instance.interceptors.response.use(
      res => {
        // console.log('全局响应拦截器res', res)
        const url = res.config.url || ''
        this.abortControllerMap.delete(url)
        return Promise.resolve(res.data)
      },
      err => Promise.reject(err)
    )
  }

  // 取消全部请求
  cancelAllRequest() {
    for (const [, controller] of this.abortControllerMap) {
      controller.abort()
    }
    this.abortControllerMap.clear()
  }

  /**
   * 取消指定的请求
   * @param url 待取消的请求 URL
   */
  cancelRequest(url) {
    const urlList = Array.isArray(url) ? url : [url]
    for (const v of urlList) {
      const controller = this.abortControllerMap.get(v)
      if (hasIn(controller, 'abort')) {
        controller.abort()
      }
      this.abortControllerMap.delete(v)
    }
  }

  get(url, params, config) {
    return new Promise((resolve, reject) => {
      this.instance
        .get(url, {
          params,
          ...config,
        })
        .then(res => {
          return resolve(res)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  post(url, data, config) {
    return new Promise((resolve, reject) => {
      this.instance
        .post(url, data, config)
        .then(res => {
          return resolve(res)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }

  request(config) {
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then(res => {
          return resolve(res)
        })
        .catch(err => {
          return reject(err)
        })
    })
  }
}

export default Request
