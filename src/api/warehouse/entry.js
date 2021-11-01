import request from '@/utils/request'

// 查询备品备件入库 列表
export function listEntry(query) {
  return request({
    url: '/warehouse/entry/list',
    method: 'get',
    params: query
  })
}

// 查询备品备件入库 详细
export function getEntry(entryId) {
  return request({
    url: '/warehouse/entry/' + entryId,
    method: 'get'
  })
}

// 新增备品备件入库 
export function addEntry(data) {
  return request({
    url: '/warehouse/entry',
    method: 'post',
    data: data
  })
}

// 修改备品备件入库 
export function updateEntry(data) {
  return request({
    url: '/warehouse/entry',
    method: 'put',
    data: data
  })
}

// 删除备品备件入库 
export function delEntry(entryId) {
  return request({
    url: '/warehouse/entry/' + entryId,
    method: 'delete'
  })
}

// 导出备品备件入库 
export function exportEntry(query) {
  return request({
    url: '/warehouse/entry/export',
    method: 'get',
    params: query
  })
}

// 模拟入库
export function simulateEntry(entryId){
  return request({
    url: '/warehouse/entry/simulate/' + entryId,
    method: 'post'
  })
}