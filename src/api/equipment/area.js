import request from '@/utils/request'

// 查询区域列表
export function listArea(query) {
  return request({
    url: '/equipment/area/list',
    method: 'get',
    params: query
  })
}

// 查询区域详细
export function getArea(areaId) {
  return request({
    url: '/equipment/area/' + areaId,
    method: 'get'
  })
}

// 新增区域
export function addArea(data) {
  return request({
    url: '/equipment/area',
    method: 'post',
    data: data
  })
}

// 修改区域
export function updateArea(data) {
  return request({
    url: '/equipment/area',
    method: 'put',
    data: data
  })
}

// 删除区域
export function delArea(areaId) {
  return request({
    url: '/equipment/area/' + areaId,
    method: 'delete'
  })
}

// 导出区域
export function exportArea(query) {
  return request({
    url: '/equipment/area/export',
    method: 'get',
    params: query
  })
}

//启用/停用区域
export function changeAreaStatus(areaId, status) {
  const data = {
    areaId,
    status
  }
  return request({
    url: '/equipment/area/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询区域树型列表
export function treeListArea(query) {
  return request({
    url: '/equipment/area/treeselect',
    method: 'get',
    params: query
  })
}

export function treeListPark(query) {
  return request({
    url: '/equipment/area/park',
    method: 'get',
    params: query
  })
}