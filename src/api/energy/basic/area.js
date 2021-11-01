import request from '@/utils/request'

// 查询能耗地理区域列表
export function listArea(query) {
  return request({
    url: '/energy/basic/area/list',
    method: 'get',
    params: query
  })
}

// 查询能耗地理区域详细
export function getArea(id) {
  return request({
    url: '/energy/basic/area/' + id,
    method: 'get'
  })
}

// 新增能耗地理区域
export function addArea(data) {
  return request({
    url: '/energy/basic/area',
    method: 'post',
    data: data
  })
}

// 修改能耗地理区域
export function updateArea(data) {
  return request({
    url: '/energy/basic/area',
    method: 'put',
    data: data
  })
}

// 删除能耗地理区域
export function delArea(id) {
  return request({
    url: '/energy/basic/area/' + id,
    method: 'delete'
  })
}

// 导出能耗地理区域
export function exportArea(query) {
  return request({
    url: '/energy/basic/area/export',
    method: 'get',
    params: query
  })
}