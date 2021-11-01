import request from '@/utils/request'

// 查询设备模板 树型
export function treeListTemplet() {
  return request({
    url: '/equipment/templet/treeselect',
    method: 'get'
  })
}

// 查询设备模板列表
export function listTemplet(query) {
  return request({
    url: '/equipment/templet/list',
    method: 'get',
    params: query
  })
}

// 查询设备模板详细
export function getTemplet(templetId) {
  return request({
    url: '/equipment/templet/' + templetId,
    method: 'get'
  })
}

// 新增设备模板
export function addTemplet(data) {
  return request({
    url: '/equipment/templet',
    method: 'post',
    data: data
  })
}

// 修改设备模板
export function updateTemplet(data) {
  return request({
    url: '/equipment/templet',
    method: 'put',
    data: data
  })
}

// 删除设备模板
export function delTemplet(templetId) {
  return request({
    url: '/equipment/templet/' + templetId,
    method: 'delete'
  })
}