import request from '@/utils/request'

/** 访客统计 */
export function visitorCount(query) {
    return request({
        url: '/vis/visitors/dataCount',
        method: 'get',
        params: query
    })
}

/** 报警统计 */
export function alarmCount(query) {
    return request({
        url: '/alarm/alarmHistories/groupCount',
        method: 'get',
        params: query
    })
}
