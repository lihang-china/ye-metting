import request from '@/utils/request'

// 查询备品备件报废 列表
export function listScrap(query) {
  return request({
    url: '/warehouse/scrap/list',
    method: 'get',
    params: query
  })
}

// 查询备品备件报废 详细
export function getScrap(scrapId) {
  return request({
    url: '/warehouse/scrap/' + scrapId,
    method: 'get'
  })
}

// 新增备品备件报废 
export function addScrap(data) {
  return request({
    url: '/warehouse/scrap',
    method: 'post',
    data: data
  })
}

// 修改备品备件报废 
export function updateScrap(data) {
  return request({
    url: '/warehouse/scrap',
    method: 'put',
    data: data
  })
}

// 删除备品备件报废 
export function delScrap(scrapId) {
  return request({
    url: '/warehouse/scrap/' + scrapId,
    method: 'delete'
  })
}

// 导出备品备件报废 
export function exportScrap(query) {
  return request({
    url: '/warehouse/scrap/export',
    method: 'get',
    params: query
  })
}

// 模拟报废
export function simulateScrap(scrapId){
  return request({
    url: '/warehouse/scrap/simulate/' + scrapId,
    method: 'post'
  })
}