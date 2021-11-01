import request from '@/utils/request'

/**
 * 以下为能耗监测接口 
 */

 // 区域用能监测（左侧统计）
export function monitorByArea(query) {
    return request({
        url: '/energy/monitor/areaCount',
        method: 'get',
        params: query
    })
}

// 区域用能监测
export function monitorByAreaRit(query) {
    return request({
        url: '/energy/monitor/areaMonitor',
        method: 'get',
        params: query
    })
}

 // 部门用能监测（左侧统计）
 export function monitorByDept(query) {
    return request({
        url: '/energy/monitor/deptCount',
        method: 'get',
        params: query
    })
}

// 部门用能监测
export function monitorByDeptRit(query) {
    return request({
        url: '/energy/monitor/deptMonitor',
        method: 'get',
        params: query
    })
}

 // 分项用能监测（左侧统计）
 export function monitorByItem(query) {
    return request({
        url: '/energy/monitor/itemCount',
        method: 'get',
        params: query
    })
}

// 分项用能监测
export function monitorByItemRit(query) {
    return request({
        url: '/energy/monitor/itemMonitor',
        method: 'get',
        params: query
    })
}