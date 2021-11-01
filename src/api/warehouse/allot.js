import request from '@/utils/request'

// 查询备品备件调拨 列表
export function listAllot(query) {
  return request({
    url: '/warehouse/allot/list',
    method: 'get',
    params: query
  })
}

// 查询备品备件调拨 详细
export function getAllot(allotId) {
  return request({
    url: '/warehouse/allot/' + allotId,
    method: 'get'
  })
}

// 新增备品备件调拨 
export function addAllot(data) {
  return request({
    url: '/warehouse/allot',
    method: 'post',
    data: data
  })
}

// 修改备品备件调拨 
export function updateAllot(data) {
  return request({
    url: '/warehouse/allot',
    method: 'put',
    data: data
  })
}

// 删除备品备件调拨 
export function delAllot(allotId) {
  return request({
    url: '/warehouse/allot/' + allotId,
    method: 'delete'
  })
}

// 导出备品备件调拨 
export function exportAllot(query) {
  return request({
    url: '/warehouse/allot/export',
    method: 'get',
    params: query
  })
}

// 模拟调拨
export function simulateAllot(allotId){
  return request({
    url: '/warehouse/allot/simulate/' + allotId,
    method: 'post'
  })
}