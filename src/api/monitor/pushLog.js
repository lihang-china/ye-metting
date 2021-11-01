import request from '@/utils/request'

// 查询推送日志列表
export function listPushLog(query) {
    return request({
        url: '/monitor/pushlog/list',
        method: 'get',
        params: query
    })
}

// 查询推送日志详细
export function getPushLog(pushId) {
    return request({
        url: '/monitor/pushlog/' + pushId,
        method: 'get'
    })
}

// 新增推送日志
export function addPushLog(data) {
    return request({
        url: '/monitor/pushlog',
        method: 'post',
        data: data
    })
}

// 删除推送日志
export function delPushLog(pushId) {
    return request({
        url: '/monitor/pushlog/' + pushId,
        method: 'delete'
    })
}

// 导出推送日志
export function exportPushLog(query) {
    return request({
        url: '/monitor/pushlog/export',
        method: 'get',
        params: query
    })
}

// 推送
export function push(pushIds) {
    return request({
        url: '/monitor/pushlog/' + pushIds,
        method: 'post'
    })
}