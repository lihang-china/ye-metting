import request from '@/utils/request'

// 查询保养项列表
export function listItem(query) {
  return request({
    url: '/maintain/item/list',
    method: 'get',
    params: query
  })
}

// 查询保养项详细
export function getItem(mitemId) {
  return request({
    url: '/maintain/item/' + mitemId,
    method: 'get'
  })
}

// 新增保养项
export function addItem(data) {
  return request({
    url: '/maintain/item',
    method: 'post',
    data: data
  })
}

// 修改保养项
export function updateItem(data) {
  return request({
    url: '/maintain/item',
    method: 'put',
    data: data
  })
}

// 删除保养项
export function delItem(mitemId) {
  return request({
    url: '/maintain/item/' + mitemId,
    method: 'delete'
  })
}

// 导出保养项
export function exportItem(query) {
  return request({
    url: '/maintain/item/export',
    method: 'get',
    params: query
  })
}

export function selectItem(query) {
  return request({
    url: '/maintain/item/select',
    method: 'get',
    params: query
  })
}

export function listByPlan(data) {
  return request({
    url: '/maintain/item/listByPlan',
    method: 'get',
    params: data
  })
}