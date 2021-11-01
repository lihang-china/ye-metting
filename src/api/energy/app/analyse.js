import request from '@/utils/request'

/**
 * 以下为能耗分析接口 
 */

// 区域部门用能趋势分析（左侧统计）
export function energyByAreaAndDept(type, query) {
    return request({
        url: '/energy/analyse/' + type + '/count',
        method: 'get',
        params: query
    })
}

// 区域部门用能趋势分析
export function energyByAreaAndDeptRit(type, query) {
    return request({
        url: '/energy/analyse/' + type + '/useTrend',
        method: 'get',
        params: query
    })
}

// 区域部门用能趋势分析每天明细
export function energyDayByAreaAndDeptRit(type, query) {
    return request({
        url: '/energy/analyse/' + type + '/dayUseTrend',
        method: 'get',
        params: query
    })
}

// 区域部门用能趋势分析每天明细
export function energyHourByAreaAndDeptRit(type, query) {
    return request({
        url: '/energy/analyse/' + type + '/hourUseTrend',
        method: 'get',
        params: query
    })
}

// 分项用能趋势分析（左侧统计）
export function energyByItem(type, query) {
    return request({
        url: '/energy/analyse/item/' + type + '/count',
        method: 'get',
        params: query
    })
}

// 分项用能趋势分析
export function energyByItemRit(type, query) {
    return request({
        url: '/energy/analyse/item/' + type + '/useTrend',
        method: 'get',
        params: query
    })
}

// 昼夜用能趋势分析（左侧统计）
export function energyByDayNight(type, query) {
    return request({
        url: '/energy/analyse/dayNight/' + type + '/count',
        method: 'get',
        params: query
    })
}

// 昼夜用能趋势分析
export function energyByDayNightRit(type, query) {
    return request({
        url: '/energy/analyse/dayNight/' + type + '/useTrend',
        method: 'get',
        params: query
    })
}

// 每周用能趋势分析（左侧统计）
export function energyByWeek(type, query) {
    return request({
        url: '/energy/analyse/week/' + type + '/count',
        method: 'get',
        params: query
    })
}

// 每周用能趋势分析
export function energyByWeekRit(type, query) {
    return request({
        url: '/energy/analyse/week/' + type + '/useTrend',
        method: 'get',
        params: query
    })
}

// 每周用能趋势分析(每天)
export function energyDayByWeekRit(type, query) {
    return request({
        url: '/energy/analyse/week/' + type + '/dayUseTrend',
        method: 'get',
        params: query
    })
}