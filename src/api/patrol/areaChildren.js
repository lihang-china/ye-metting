import request from '@/utils/request'

export function save(data) {
  return request({
    url: '/patrol/areachildren',
    method: 'put',
    data: data
  })
}

export function remove(pareaId, equIds) {
  return request({
    url: '/patrol/areachildren/' + pareaId + '/' + equIds,
    method: 'delete'
  })
}

export function add(pareaId, equIds) {
  return request({
    url: '/patrol/areachildren/' + pareaId + '/' + equIds,
    method: 'post'
  })
}

export function getInfo(pareaId, equId) {
  return request({
    url: '/patrol/areachildren/' + pareaId + '/' + equId,
    method: 'get'
  })
}