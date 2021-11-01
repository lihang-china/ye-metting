import request from '@/utils/request'

// 查询巡检区域列表
export function listArea(query) {
  return request({
    url: '/patrol/area/list',
    method: 'get',
    params: query
  })
}

// 查询巡检区域详细
export function getArea(pareaId) {
  return request({
    url: '/patrol/area/' + pareaId,
    method: 'get'
  })
}

// 新增巡检区域
export function addArea(data) {
  return request({
    url: '/patrol/area',
    method: 'post',
    data: data
  })
}

// 修改巡检区域
export function updateArea(data) {
  return request({
    url: '/patrol/area',
    method: 'put',
    data: data
  })
}

// 删除巡检区域
export function delArea(pareaId) {
  return request({
    url: '/patrol/area/' + pareaId,
    method: 'delete'
  })
}

// 导出巡检区域
export function exportArea(query) {
  return request({
    url: '/patrol/area/export',
    method: 'get',
    params: query
  })
}

export function listByLine(plineId, query) {
  return request({
    url: '/patrol/area/listByLine/' + plineId,
    method: 'get',
    params: query
  })
}

export function listNoByLine(plineId, query) {
  return request({
    url: '/patrol/area/listNoByLine/' + plineId,
    method: 'get',
    params: query
  })
}

export function changeAreaStatus(pareaId, status) {
  return request({
    url: '/patrol/area/changeStatus/' + pareaId + '/' + status,
    method: 'put'
  })
}