import request from '@/utils/request'

// 查询GIS图层管理列表
export function listLayer(query) {
  return request({
    url: '/gis/layer/list',
    method: 'get',
    params: query
  })
}

// 查询GIS图层管理详细
export function getLayer(id) {
  return request({
    url: '/gis/layer/' + id,
    method: 'get'
  })
}

// 新增GIS图层管理
export function addLayer(data) {
  return request({
    url: '/gis/layer',
    method: 'post',
    data: data
  })
}

// 修改GIS图层管理
export function updateLayer(data) {
  return request({
    url: '/gis/layer',
    method: 'put',
    data: data
  })
}

// 删除GIS图层管理
export function delLayer(id) {
  return request({
    url: '/gis/layer/' + id,
    method: 'delete'
  })
}

// 导出GIS图层管理
export function exportLayer(query) {
  return request({
    url: '/gis/layer/export',
    method: 'get',
    params: query
  })
}

// 查询GIS图层管理列表 全部
export function listLayerAll() {
  return request({
    url: '/gis/layer/list/all',
    method: 'get'
  })
}