import request from '@/utils/request'

// 查询备品备件 列表
export function listSp(query) {
  return request({
    url: '/warehouse/sp/list',
    method: 'get',
    params: query
  })
}

// 查询备品备件 详细
export function getSp(spId) {
  return request({
    url: '/warehouse/sp/' + spId,
    method: 'get'
  })
}

// 新增备品备件 
export function addSp(data) {
  return request({
    url: '/warehouse/sp',
    method: 'post',
    data: data
  })
}

// 修改备品备件 
export function updateSp(data) {
  return request({
    url: '/warehouse/sp',
    method: 'put',
    data: data
  })
}

// 删除备品备件 
export function delSp(spId) {
  return request({
    url: '/warehouse/sp/' + spId,
    method: 'delete'
  })
}

// 导出备品备件 
export function exportSp(query) {
  return request({
    url: '/warehouse/sp/export',
    method: 'get',
    params: query
  })
}

export function getListSp(query) {
  return request({
    url: '/warehouse/sp/listSp',
    method: 'get',
    params: query
  })
}

export function getListSpRoom(query) {
  return request({
    url: '/warehouse/sp/listSpRoom',
    method: 'get',
    params: query
  })
}

export function getListSpUse(query) {
  return request({
    url: '/warehouse/sp/listSpUse',
    method: 'get',
    params: query
  })
}

export function getSearchListSp(query) {
  return request({
    url: '/warehouse/sp/search/Sp',
    method: 'get',
    params: query
  })
}

export function getSearchListUser(deptId) {
  return request({
    url: '/warehouse/sp/search/users/' + deptId,
    method: 'get'
  })
}

export function getRecord(query) {
  return request({
    url: '/warehouse/sp/record',
    method: 'get',
    params: query
  })
}

export function getRecordUse(query) {
  return request({
    url: '/warehouse/sp/record/use',
    method: 'get',
    params: query
  })
}

export function getOperate(operate, operateId) {
  return request({
    url: '/warehouse/' + operate + '/' + operateId,
    method: 'get'
  })
}