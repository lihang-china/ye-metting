import request from '@/utils/request'

// 查询设备分类列表
export function listClass(query) {
  return request({
    url: '/equipment/class/list',
    method: 'get',
    params: query
  })
}

// 查询设备分类详细
export function getClass(classId) {
  return request({
    url: '/equipment/class/' + classId,
    method: 'get'
  })
}

// 新增设备分类
export function addClass(data) {
  return request({
    url: '/equipment/class',
    method: 'post',
    data: data
  })
}

// 修改设备分类
export function updateClass(data) {
  return request({
    url: '/equipment/class',
    method: 'put',
    data: data
  })
}

// 删除设备分类
export function delClass(classId) {
  return request({
    url: '/equipment/class/' + classId,
    method: 'delete'
  })
}

// 导出设备分类
export function exportClass(query) {
  return request({
    url: '/equipment/class/export',
    method: 'get',
    params: query
  })
}

//启用/停用设备分类
export function changeClassStatus(classId, status) {
  const data = {
    classId,
    status
  }
  return request({
    url: '/equipment/class/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询设备分类树型列表
export function treeListClass(query) {
  return request({
    url: '/equipment/class/treeselect',
    method: 'get',
    params: query
  })
}