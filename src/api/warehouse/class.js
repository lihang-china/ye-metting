import request from '@/utils/request'

// 查询分类管理列表
export function listClass(query) {
  return request({
    url: '/warehouse/class/list',
    method: 'get',
    params: query
  })
}

// 查询分类管理详细
export function getClass(whclassId) {
  return request({
    url: '/warehouse/class/' + whclassId,
    method: 'get'
  })
}

// 新增分类管理
export function addClass(data) {
  return request({
    url: '/warehouse/class',
    method: 'post',
    data: data
  })
}

// 修改分类管理
export function updateClass(data) {
  return request({
    url: '/warehouse/class',
    method: 'put',
    data: data
  })
}

// 删除分类管理
export function delClass(whclassId) {
  return request({
    url: '/warehouse/class/' + whclassId,
    method: 'delete'
  })
}

// 导出分类管理
export function exportClass(query) {
  return request({
    url: '/warehouse/class/export',
    method: 'get',
    params: query
  })
}

// 查询维修分类树型列表
export function treeListClass(query) {
  return request({
    url: '/warehouse/class/treeselect',
    method: 'get',
    params: query
  })
}