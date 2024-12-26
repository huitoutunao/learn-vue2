import { requestor } from '@/service/case-axios'

// 片区登录
export const apiLogin = data =>
  requestor.post('/login', data, {
    custom: {
      isLogin: true,
    },
  })

// 获取地市
export const apiGetCitysBy = (data, config) =>
  requestor.post('/getCitysBy', data, config)
