import request from '@/utils/request'

// 查询维修工单列表
export function listCard(query) {
  return request({
    url: '/repair/card/list',
    method: 'get',
    params: query
  })
}

// 查询维修工单详细
export function getCard(repairId) {
  return request({
    url: '/repair/card/' + repairId,
    method: 'get'
  })
}

// 新增维修工单
export function addCard(data) {
  return request({
    url: '/repair/card',
    method: 'post',
    data: data
  })
}

// 修改维修工单
export function updateCard(data) {
  return request({
    url: '/repair/card',
    method: 'put',
    data: data
  })
}

// 删除维修工单
export function delCard(repairId) {
  return request({
    url: '/repair/card/' + repairId,
    method: 'delete'
  })
}

// 导出维修工单
export function exportCard(query) {
  return request({
    url: '/repair/card/export',
    method: 'get',
    params: query
  })
}