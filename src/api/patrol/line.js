import request from '@/utils/request'

// 查询巡检路线 列表
export function listLine(query) {
  return request({
    url: '/patrol/line/list',
    method: 'get',
    params: query
  })
}

// 查询巡检路线 详细
export function getLine(plineId) {
  return request({
    url: '/patrol/line/' + plineId,
    method: 'get'
  })
}

// 新增巡检路线 
export function addLine(data) {
  return request({
    url: '/patrol/line',
    method: 'post',
    data: data
  })
}

// 修改巡检路线 
export function updateLine(data) {
  return request({
    url: '/patrol/line',
    method: 'put',
    data: data
  })
}

// 删除巡检路线 
export function delLine(plineId) {
  return request({
    url: '/patrol/line/' + plineId,
    method: 'delete'
  })
}

// 导出巡检路线 
export function exportLine(query) {
  return request({
    url: '/patrol/line/export',
    method: 'get',
    params: query
  })
}

export function changeLineStatus(plineIds, status) {
  return request({
    url: '/patrol/line/changeStatus/' + plineIds + '/' + status,
    method: 'put'
  })
}