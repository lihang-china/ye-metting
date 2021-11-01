import request from '@/utils/request'

// 查询单位列表
export function listParameter() {
  return request({
    url: '/equipment/parameter/list',
    method: 'get'
  })
}