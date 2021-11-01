import request from '@/utils/request'

// 查询备品备件盘点 列表
export function listInventory(query) {
  return request({
    url: '/warehouse/inventory/list',
    method: 'get',
    params: query
  })
}

// 查询备品备件盘点 详细
export function getInventory(inventoryId) {
  return request({
    url: '/warehouse/inventory/' + inventoryId,
    method: 'get'
  })
}

// 新增备品备件盘点 
export function addInventory(data) {
  return request({
    url: '/warehouse/inventory',
    method: 'post',
    data: data
  })
}

// 修改备品备件盘点 
export function updateInventory(data) {
  return request({
    url: '/warehouse/inventory',
    method: 'put',
    data: data
  })
}

// 删除备品备件盘点 
export function delInventory(inventoryId) {
  return request({
    url: '/warehouse/inventory/' + inventoryId,
    method: 'delete'
  })
}

// 导出备品备件盘点 
export function exportInventory(query) {
  return request({
    url: '/warehouse/inventory/export',
    method: 'get',
    params: query
  })
}

// 模拟盘点
export function simulateInventory(inventoryId){
  return request({
    url: '/warehouse/inventory/simulate/' + inventoryId,
    method: 'post'
  })
}