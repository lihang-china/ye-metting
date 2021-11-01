import request from '@/utils/request'

export function addWork(data) {
    return request({
        url: '/workflow/works',
        method: 'post',
        data: data
    })
}

export function runWorkList(params) {
    return request({
        url: '/workflow/works/myStart/run',
        method: 'get',
        params: params
    })
}

export function hisWorkList(params) {
    return request({
        url: '/workflow/works/',
        method: 'get',
        params: params
    })
}

export function runWorkDel(workId, params) {
    return request({
        url: '/workflow/works/' + workId + '/run',
        method: 'delete',
        params: params
    })
}

export function hisWorkDel(workIds) {
    return request({
        url: '/workflow/works/' + workIds + '/his',
        method: 'delete'
    })
}

export function receiveWorkList(params) {
    return request({
        url: '/workflow/tasks/todo',
        method: 'get',
        params: params
    })
}

export function candidates(taskId, params) {
    return request({
        url: '/workflow/tasks/' + taskId + '/candidates',
        method: 'post',
        params: params
    })
}

export function receiveWork(taskId) {
    return request({
        url: '/workflow/tasks/' + taskId + '/receiveTask',
        method: 'post'
    })
}

export function myWorkList(params) {
    return request({
        url: '/workflow/tasks/myTasks',
        method: 'get',
        params: params,
    })
}

export function getPage(taskId) {
    return request({
        url: '/workflow/tasks/' + taskId + '/completeTaskPage',
        method: 'get'
    })
}

export function submitWork(url, params) {
    return request({
        url: '/workflow/motion' + url,
        method: 'get',
        params: params,
    })
}

export function didWorkList(params) {
    return request({
        url: '/workflow/tasks/did',
        method: 'get',
        params: params,
    })
}

export function entrustWork(taskId, params) {
    return request({
        url: '/workflow/tasks/' + taskId + '/assignee',
        method: 'post',
        params: params
    })
}

export function entrustWorkList(type, params) {
    return request({
        url: '/workflow/entrust/' + type,
        method: 'get',
        params: params,
    })
}

export function revokeEntrust(taskId){
    return request({
        url: '/workflow/tasks/' + taskId + '/entrust/revoke',
        method: 'post'
    })
}