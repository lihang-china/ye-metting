import request from '@/utils/request'

export function listFlow(query) {
    return request({
        url: '/workflow/flows',
        method: 'get',
        params: query
    })
}

export function getFlow(workFlowId) {
    return request({
        url: '/workflow/flows/' + workFlowId,
        method: 'get'
    })
}

export function addFlow(data) {
    return request({
        url: '/workflow/flows',
        method: 'post',
        data: data
    })
}

export function updateFlow(workFlowId, data) {
    return request({
        url: '/workflow/flows/' + workFlowId,
        method: 'put',
        data: data
    })
}

export function copyFlow(workFlowId, data) {
    return request({
        url: '/workflow/flows/' + workFlowId + "/copy",
        method: 'post',
        data: data
    })
}

export function delFlow(workFlowIds) {
    return request({
        url: '/workflow/flows/' + workFlowIds,
        method: 'delete'
    })
}

export function deployFlow(workFlowId) {
    return request({
        url: '/workflow/flows/' + workFlowId + "/deploy",
        method: 'post'
    })
}
