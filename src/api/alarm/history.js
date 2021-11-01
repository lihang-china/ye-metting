import request from '@/utils/request'

// 查询历史报警记录
export function listAlarmHistory(query) {
    return request({
        url: '/alarm/alarmHistories/page',
        method: 'get',
        params: query
    })
}