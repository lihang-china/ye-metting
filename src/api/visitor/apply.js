import request from '@/utils/request'

// 查询访客列表
export function listVisitor(query) {
  return request({
    url: '/vis/visitors',
    method: 'get',
    params: query
  })
}

// 查询访客详细
export function getVisitor(id) {
  return request({
    url: '/vis/visitors/' + id,
    method: 'get'
  })
}

// 新增访客
export function addVisitor(data) {
  return request({
    url: '/vis/visitors',
    method: 'post',
    data: data
  })
}

// 修改访客
export function updateVisitor(id, data) {
  return request({
    url: '/vis/visitors/' + id,
    method: 'put',
    data: data
  })
}

// 删除访客
export function delVisitor(id) {
  return request({
    url: '/vis/visitors/' + id,
    method: 'delete'
  })
}

// 修改访客
export function submitVisitor(ids) {
  return request({
    url: '/vis/visitors/' + ids + '/approve',
    method: 'post'
  })
}

// 查询访客列表
export function listSearchVisitor(query) {
  return request({
    url: '/vis/visitors/search',
    method: 'get',
    params: query
  })
}

export function getQRCode(id) {
  return request({
    url: '/vis/visitors/' + id + '/qrCode',
    method: 'get',
    responseType: 'blob',
  })
}