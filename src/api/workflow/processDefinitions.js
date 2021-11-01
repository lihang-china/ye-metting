import request from '@/utils/request'

export function listProcessDefinitions(query) {
    return request({
        url: '/workflow/processDefinitions',
        method: 'get',
        params: query
    })
}

export function assigneeProcessDefinitions(processDefinitionId) {
    return request({
        url: '/workflow/processDefinitions/' + processDefinitionId + "/assignee",
        method: 'get'
    })
}

export function delProcessDefinitions(deploymentIds) {
    return request({
        url: '/workflow/processDefinitions/' + deploymentIds,
        method: 'delete'
    })
}