import request from '@/utils/request'

// 查询人员管理 列表
export function listStaff(query) {
  return request({
    url: '/equipment/staff/list',
    method: 'get',
    params: query
  })
}

// 查询人员管理 全部
export function listStaffAll(query) {
  return request({
    url: '/equipment/staff/list/all',
    method: 'get',
    params: query
  })
}

// 查询人员管理 详细
export function getStaff(staffId) {
  return request({
    url: '/equipment/staff/' + staffId,
    method: 'get'
  })
}

// 新增人员管理 
export function addStaff(data) {
  return request({
    url: '/equipment/staff',
    method: 'post',
    data: data
  })
}

// 修改人员管理 
export function updateStaff(data) {
  return request({
    url: '/equipment/staff',
    method: 'put',
    data: data
  })
}

// 删除人员管理 
export function delStaff(staffId) {
  return request({
    url: '/equipment/staff/' + staffId,
    method: 'delete'
  })
}

// 导出人员管理 
export function exportStaff(query) {
  return request({
    url: '/equipment/staff/export',
    method: 'get',
    params: query
  })
}