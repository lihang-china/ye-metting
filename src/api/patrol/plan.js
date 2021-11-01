import request from '@/utils/request'

// 查询巡检计划 列表
export function listPlan(query) {
  return request({
    url: '/patrol/plan/list',
    method: 'get',
    params: query
  })
}

// 查询巡检计划 详细
export function getPlan(planId) {
  return request({
    url: '/patrol/plan/' + planId,
    method: 'get'
  })
}

// 新增巡检计划 
export function addPlan(data) {
  return request({
    url: '/patrol/plan',
    method: 'post',
    data: data
  })
}

// 修改巡检计划 
export function updatePlan(data) {
  return request({
    url: '/patrol/plan',
    method: 'put',
    data: data
  })
}

// 删除巡检计划 
export function delPlan(planId) {
  return request({
    url: '/patrol/plan/' + planId,
    method: 'delete'
  })
}

// 导出巡检计划 
export function exportPlan(query) {
  return request({
    url: '/patrol/plan/export',
    method: 'get',
    params: query
  })
}

export function changePlanStatus(planId, status) {
  return request({
    url: '/patrol/plan/changeStatus/' + planId + '/' + status,
    method: 'put'
  })
}

//生成巡检计划
export function createTask(planId) {
  return request({
    url: '/patrol/plan/creatTask/' + planId,
    method: 'post'
  })
}