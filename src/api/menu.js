import request from '@/utils/request'

// 获取路由
export const getRouters = (sysRouter) => {
  return request({
    url: '/getRouters/' + sysRouter,
    method: 'get'
  })
}