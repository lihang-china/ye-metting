import request from '@/utils/request'

// 查询备品备件退库 列表
export function listReturn(query) {
  return request({
    url: '/warehouse/return/list',
    method: 'get',
    params: query
  })
}

// 查询备品备件退库 详细
export function getReturn(returnId) {
  return request({
    url: '/warehouse/return/' + returnId,
    method: 'get'
  })
}

// 新增备品备件退库 
export function addReturn(data) {
  return request({
    url: '/warehouse/return',
    method: 'post',
    data: data
  })
}

// 修改备品备件退库 
export function updateReturn(data) {
  return request({
    url: '/warehouse/return',
    method: 'put',
    data: data
  })
}

// 删除备品备件退库 
export function delReturn(returnId) {
  return request({
    url: '/warehouse/return/' + returnId,
    method: 'delete'
  })
}

// 导出备品备件退库 
export function exportReturn(query) {
  return request({
    url: '/warehouse/return/export',
    method: 'get',
    params: query
  })
}

// 模拟退库 
export function simulateReturn(returnId){
  return request({
    url: '/warehouse/return/simulate/' + returnId,
    method: 'post'
  })
}