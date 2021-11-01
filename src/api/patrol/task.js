import request from '@/utils/request'

// 查询巡检任务 列表
export function listTask(query) {
  return request({
    url: '/patrol/task/list',
    method: 'get',
    params: query
  })
}

// 查询巡检任务 详细
export function getTask(taskId) {
  return request({
    url: '/patrol/task/' + taskId,
    method: 'get'
  })
}

// 新增巡检任务 
export function addTask(data) {
  return request({
    url: '/patrol/task',
    method: 'post',
    data: data
  })
}

// 修改巡检任务 
export function updateTask(data) {
  return request({
    url: '/patrol/task',
    method: 'put',
    data: data
  })
}

// 删除巡检任务 
export function delTask(taskId) {
  return request({
    url: '/patrol/task/' + taskId,
    method: 'delete'
  })
}

// 导出巡检任务 
export function exportTask(query) {
  return request({
    url: '/patrol/task/export',
    method: 'get',
    params: query
  })
}