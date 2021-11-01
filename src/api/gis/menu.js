import request from '@/utils/request'

// 查询菜单图层管理列表
export function listMenu(query) {
  return request({
    url: '/gis/menu/list',
    method: 'get',
    params: query
  })
}

// 查询菜单图层管理详细
export function getMenu(id) {
  return request({
    url: '/gis/menu/' + id,
    method: 'get'
  })
}

// 新增菜单图层管理
export function addMenu(data) {
  return request({
    url: '/gis/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单图层管理
export function updateMenu(data) {
  return request({
    url: '/gis/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单图层管理
export function delMenu(id) {
  return request({
    url: '/gis/menu/' + id,
    method: 'delete'
  })
}

// 导出菜单图层管理
export function exportMenu(query) {
  return request({
    url: '/gis/menu/export',
    method: 'get',
    params: query
  })
}

// 查询菜单图层树型列表
export function treeListMenu(query) {
  return request({
    url: '/gis/menu/treeselect',
    method: 'get',
    params: query
  })
}

// 查询菜单图层配置
export function gisMenuConfig(type) {
  return request({
    url: '/gis/menu/gisMenuConfig/' + type,
    method: 'get'
  })
}

