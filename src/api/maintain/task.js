import request from '@/utils/request'

// 查询保养任务列表
export function listTask(query) {
  return request({
    url: '/maintain/task/list',
    method: 'get',
    params: query
  })
}

// 查询保养任务详细
export function getTask(taskId) {
  return request({
    url: '/maintain/task/' + taskId,
    method: 'get'
  })
}

// 新增保养任务
export function addTask(data) {
  return request({
    url: '/maintain/task',
    method: 'post',
    data: data
  })
}

// 修改保养任务
export function updateTask(data) {
  return request({
    url: '/maintain/task',
    method: 'put',
    data: data
  })
}

// 删除保养任务
export function delTask(taskId) {
  return request({
    url: '/maintain/task/' + taskId,
    method: 'delete'
  })
}

// 导出保养任务
export function exportTask(query) {
  return request({
    url: '/maintain/task/export',
    method: 'get',
    params: query
  })
}