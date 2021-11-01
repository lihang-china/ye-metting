import request from '@/utils/request'

// 查询能耗部门配置列表
export function listDeptConfigSetting(query) {
  return request({
    url: '/energy/basic/deptConfig/list/setting',
    method: 'get',
    params: query
  })
}

// 查询能耗部门配置列表
export function listDeptConfig(query) {
  return request({
    url: '/energy/basic/deptConfig/list',
    method: 'get',
    params: query
  })
}

// 查询能耗部门配置详细
export function getDeptConfig(id) {
  return request({
    url: '/energy/basic/deptConfig/' + id,
    method: 'get'
  })
}

// 新增能耗部门配置
export function addDeptConfig(data) {
  return request({
    url: '/energy/basic/deptConfig',
    method: 'post',
    data: data
  })
}

// 修改能耗部门配置
export function updateDeptConfig(data) {
  return request({
    url: '/energy/basic/deptConfig',
    method: 'put',
    data: data
  })
}

// 删除能耗部门配置
export function delDeptConfig(id) {
  return request({
    url: '/energy/basic/deptConfig/' + id,
    method: 'delete'
  })
}

// 导出能耗部门配置
export function exportDeptConfig(query) {
  return request({
    url: '/energy/basic/deptConfig/export',
    method: 'get',
    params: query
  })
}