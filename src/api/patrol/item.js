import request from '@/utils/request'

// 查询巡检项列表
export function listItem(query) {
  return request({
    url: '/patrol/item/list',
    method: 'get',
    params: query
  })
}

// 查询巡检项详细
export function getItem(pitemId) {
  return request({
    url: '/patrol/item/' + pitemId,
    method: 'get'
  })
}

// 新增巡检项
export function addItem(data) {
  return request({
    url: '/patrol/item',
    method: 'post',
    data: data
  })
}

// 修改巡检项
export function updateItem(data) {
  return request({
    url: '/patrol/item',
    method: 'put',
    data: data
  })
}

// 删除巡检项
export function delItem(pitemId) {
  return request({
    url: '/patrol/item/' + pitemId,
    method: 'delete'
  })
}

// 导出巡检项
export function exportItem(query) {
  return request({
    url: '/patrol/item/export',
    method: 'get',
    params: query
  })
}

export function listByParea(pareaId, equId) {
  return request({
    url: '/patrol/item/listByParea/' + pareaId + '/' + equId,
    method: 'get'
  })
}
