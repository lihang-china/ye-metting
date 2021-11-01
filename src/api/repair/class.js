import request from '@/utils/request'

// 查询维修分类 列表
export function listClass(query) {
  return request({
    url: '/repair/class/list',
    method: 'get',
    params: query
  })
}

// 查询维修分类 详细
export function getClass(reclassId) {
  return request({
    url: '/repair/class/' + reclassId,
    method: 'get'
  })
}

// 新增维修分类 
export function addClass(data) {
  return request({
    url: '/repair/class',
    method: 'post',
    data: data
  })
}

// 修改维修分类 
export function updateClass(data) {
  return request({
    url: '/repair/class',
    method: 'put',
    data: data
  })
}

// 删除维修分类 
export function delClass(reclassId) {
  return request({
    url: '/repair/class/' + reclassId,
    method: 'delete'
  })
}

// 导出维修分类 
export function exportClass(query) {
  return request({
    url: '/repair/class/export',
    method: 'get',
    params: query
  })
}

// 查询维修分类树型列表
export function treeListClass(query) {
  return request({
    url: '/repair/class/treeselect',
    method: 'get',
    params: query
  })
}