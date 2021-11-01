import request from '@/utils/request'

// 查询备品备件出库 列表
export function listExit(query) {
  return request({
    url: '/warehouse/exit/list',
    method: 'get',
    params: query
  })
}

// 查询备品备件出库 详细
export function getExit(exitId) {
  return request({
    url: '/warehouse/exit/' + exitId,
    method: 'get'
  })
}

// 新增备品备件出库 
export function addExit(data) {
  return request({
    url: '/warehouse/exit',
    method: 'post',
    data: data
  })
}

// 修改备品备件出库 
export function updateExit(data) {
  return request({
    url: '/warehouse/exit',
    method: 'put',
    data: data
  })
}

// 删除备品备件出库 
export function delExit(exitId) {
  return request({
    url: '/warehouse/exit/' + exitId,
    method: 'delete'
  })
}

// 导出备品备件出库 
export function exportExit(query) {
  return request({
    url: '/warehouse/exit/export',
    method: 'get',
    params: query
  })
}

// 模拟出库
export function simulateExit(exitId){
  return request({
    url: '/warehouse/exit/simulate/' + exitId,
    method: 'post'
  })
}