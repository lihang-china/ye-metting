import request from '@/utils/request'

// 查询保养计划列表
export function listPlan(query) {
  return request({
    url: '/maintain/plan/list',
    method: 'get',
    params: query
  })
}

// 查询保养计划详细
export function getPlan(planId) {
  return request({
    url: '/maintain/plan/' + planId,
    method: 'get'
  })
}

// 新增保养计划
export function addPlan(data) {
  return request({
    url: '/maintain/plan',
    method: 'post',
    data: data
  })
}

// 修改保养计划
export function updatePlan(data) {
  return request({
    url: '/maintain/plan',
    method: 'put',
    data: data
  })
}

// 删除保养计划
export function delPlan(planId) {
  return request({
    url: '/maintain/plan/' + planId,
    method: 'delete'
  })
}

// 导出保养计划
export function exportPlan(query) {
  return request({
    url: '/maintain/plan/export',
    method: 'get',
    params: query
  })
}

export function changePlanStatus(planId, status) {
  return request({
    url: '/maintain/plan/changeStatus/' + planId + '/' + status,
    method: 'put'
  })
}

//生成保养计划
export function createTask(planId) {
  return request({
    url: '/maintain/plan/creatTask/' + planId,
    method: 'post'
  })
}