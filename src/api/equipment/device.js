import request from '@/utils/request'

// 注册/注销 设备
export function operateDev(params) {
    return request({
        url: '/equipment/card/action',
        method: 'get',
        params: params
    })
}

// 读取实时/历史数据 位号
export function operateChannel(params) {
    return request({
        url: '/equipment/channel/action',
        method: 'get',
        params: params
    })
}