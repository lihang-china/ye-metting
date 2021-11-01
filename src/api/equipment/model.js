import request from '@/utils/request'

export function getModel(equId) {
    return request({
        url: '/equipment/model/' + equId,
        method: 'get'
    })
}

export function saveModel(data) {
    return request({
        url: '/equipment/model',
        method: 'post',
        data: data
    })
}