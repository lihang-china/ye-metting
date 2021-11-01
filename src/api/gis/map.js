import request from '@/utils/request'

// 查询GIS地图管理列表
export function listMap(query) {
  return request({
    url: '/gis/map/list',
    method: 'get',
    params: query
  })
}

// 查询GIS地图管理详细
export function getMap(id) {
  return request({
    url: '/gis/map/' + id,
    method: 'get'
  })
}

// 新增GIS地图管理
export function addMap(data) {
  return request({
    url: '/gis/map',
    method: 'post',
    data: data
  })
}

// 修改GIS地图管理
export function updateMap(data) {
  return request({
    url: '/gis/map',
    method: 'put',
    data: data
  })
}

// 删除GIS地图管理
export function delMap(id) {
  return request({
    url: '/gis/map/' + id,
    method: 'delete'
  })
}

// 导出GIS地图管理
export function exportMap(query) {
  return request({
    url: '/gis/map/export',
    method: 'get',
    params: query
  })
}

// 查询GIS地图管理列表
export function listMapCopy() {
  return request({
    url: '/gis/map/list/copy',
    method: 'get'
  })
}

