import request from '@/utils/request'

export function listFlowType(query) {
    return request({
        url: '/workflow/flowTypes',
        method: 'get',
        params: query
    })
}

export function getFlowType(flowTypeId) {
    return request({
        url: '/workflow/flowTypes/' + flowTypeId,
        method: 'get'
    })
}

export function treeListFlowType(query) {
    return request({
        url: '/workflow/flowTypes/treeselect',
        method: 'get',
        params: query
    })
}

export function addFlowType(data) {
    return request({
        url: '/workflow/flowTypes',
        method: 'post',
        data: data
    })
}

export function updateFlowType(flowTypeId, data) {
    return request({
        url: '/workflow/flowTypes/' + flowTypeId,
        method: 'put',
        data: data
    })
}

export function delFlowType(flowTypeIds) {
    return request({
        url: '/workflow/flowTypes/' + flowTypeIds,
        method: 'delete'
    })
}

export function changeFlowTypeStatus(data) {
    return request({
      url: '/workflow/flowTypes/changeStatus',
      method: 'put',
      data: data
    })
  }
