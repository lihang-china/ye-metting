import request from '@/utils/request'

// 查询网关列表
export function listGW(query) {
    return request({
        url: '/equipment/gatewayEcs',
        method: 'get',
        params: query
    })
}

// 查询网关详细
export function getGW(gatewayEcId) {
    return request({
        url: '/equipment/gatewayEcs/' + gatewayEcId,
        method: 'get'
    })
}

// 新增网关
export function addGW(data) {
    return request({
        url: '/equipment/gatewayEcs',
        method: 'post',
        data: data
    })
}

// 修改网关
export function updateGW(gatewayEcId, data) {
    return request({
        url: '/equipment/gatewayEcs/' + gatewayEcId,
        method: 'put',
        data: data
    })
}

// 删除网关
export function delGW(gatewayEcIds) {
    return request({
        url: '/equipment/gatewayEcs/' + gatewayEcIds,
        method: 'delete'
    })
}

// 操作网关（登录、登出、查询设备）
export function operateGW(params) {
    return request({
        url: '/equipment/gatewayEcs/action',
        method: 'get',
        params: params
    })
}

// 同步设备
export function syncDevices(classId, data) {
    return request({
        url: '/equipment/gatewayEcs/ecDevices/sync',
        method: 'post',
        params: {
            classId: classId
        },
        data: data
    })
}

// 获取所属网关
export function listGateway(){
    return request({
        url: '/equipment/gatewayEcs/use',
        method: 'get'
    })
}

// 获取设备（一级为网关,二级为设备）
export function getDevices(){
    return request({
        url: '/equipment/gatewayEcs/devices',
        method: 'get'
    })
}