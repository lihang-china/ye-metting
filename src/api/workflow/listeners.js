import request from '@/utils/request'

// 查询流程监听器列表
export function listListeners(query) {
    return request({
        url: '/workflow/listeners',
        method: 'get',
        params: query
    })
}

// 查询流程监听器详细
export function getListeners(listenerId) {
    return request({
        url: '/workflow/listeners/' + listenerId,
        method: 'get'
    })
}

// 新增流程监听器
export function addListeners(data) {
    return request({
        url: '/workflow/listeners',
        method: 'post',
        data: data
    })
}

// 修改流程监听器
export function updateListeners(listenerId, data) {
    return request({
        url: '/workflow/listeners/' + listenerId,
        method: 'put',
        data: data
    })
}

// 删除流程监听器
export function delListeners(listenerIds) {
    return request({
        url: '/workflow/listeners/' + listenerIds,
        method: 'delete'
    })
}