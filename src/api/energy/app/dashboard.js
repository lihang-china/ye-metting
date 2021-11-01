import request from '@/utils/request'

// 查询能耗地理区域列表
export function dashboard(nhType) {
  return request({
    url: '/energy/query/overview/index/' + nhType,
    method: 'get'
  })
}