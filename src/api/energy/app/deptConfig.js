import request from '@/utils/request'

// 查询能耗地理区域列表
export function list(params) {
  return request({
    url: '/energy/basic/deptConfig/list',
    method: 'get',
    params
  })
}