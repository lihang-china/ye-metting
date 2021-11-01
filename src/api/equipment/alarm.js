import request from '@/utils/request'

/** 获取实时报警数据 */
export function getRealAlarm(params) {
    return request({
        url: '/equipment/alarmItems',
        method: 'get',
        params: params
    })
}

/** 获取历史报警数据 */
export function getHistoryAlarm(params) {
    return request({
        url: '/equipment/alarmItems/page',
        method: 'get',
        params: params
    })
}

/** 报警处理 */
export function dealAlarm(channelIds) {
    return request({
        url: '/equipment/channel/' + channelIds + '/resetEventCount',
        method: 'post'
    })
}