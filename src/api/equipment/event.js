import request from '@/utils/request'

export function listEvent(query) {
    return request({
        url: '/equipment/channelEvents',
        method: 'get',
        params: query
    })
}

export function getEvent(channelEventId) {
    return request({
        url: '/equipment/channelEvents/' + channelEventId,
        method: 'get'
    })
}

export function addEvent(data) {
    return request({
        url: '/equipment/channelEvents',
        method: 'post',
        data: data
    })
}

export function updateEvent(channelEventId, data) {
    return request({
        url: '/equipment/channelEvents/' + channelEventId,
        method: 'put',
        data: data
    })
}

export function delEvent(channelEventIds) {
    return request({
        url: '/equipment/channelEvents/' + channelEventIds,
        method: 'delete'
    })
}