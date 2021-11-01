import request from '@/utils/request'

// 查询能耗部门管理列表
export function listDept(query) {
  return request({
    url: '/energy/basic/dept/list',
    method: 'get',
    params: query
  })
}

// 查询能耗部门管理详细
export function getDept(id) {
  return request({
    url: '/energy/basic/dept/' + id,
    method: 'get'
  })
}

// 新增能耗部门管理
export function addDept(data) {
  return request({
    url: '/energy/basic/dept',
    method: 'post',
    data: data
  })
}

// 修改能耗部门管理
export function updateDept(data) {
  return request({
    url: '/energy/basic/dept',
    method: 'put',
    data: data
  })
}

// 删除能耗部门管理
export function delDept(id) {
  return request({
    url: '/energy/basic/dept/' + id,
    method: 'delete'
  })
}

// 导出能耗部门管理
export function exportDept(query) {
  return request({
    url: '/energy/basic/dept/export',
    method: 'get',
    params: query
  })
}