import request from '@/utils/request'

// 查询系统命名规约列表
export function listRule(query) {
  return request({
    url: '/gis/rule/list',
    method: 'get',
    params: query
  })
}

// 查询系统命名规约详细
export function getRule(id) {
  return request({
    url: '/gis/rule/' + id,
    method: 'get'
  })
}

// 新增系统命名规约
export function addRule(data) {
  return request({
    url: '/gis/rule',
    method: 'post',
    data: data
  })
}

// 修改系统命名规约
export function updateRule(data) {
  return request({
    url: '/gis/rule',
    method: 'put',
    data: data
  })
}

// 删除系统命名规约
export function delRule(id) {
  return request({
    url: '/gis/rule/' + id,
    method: 'delete'
  })
}

// 导出系统命名规约
export function exportRule(query) {
  return request({
    url: '/gis/rule/export',
    method: 'get',
    params: query
  })
}

// 查询系统命名规约树型列表
export function treeListRule(query) {
  return request({
    url: '/gis/rule/treeselect',
    method: 'get',
    params: query
  })
}