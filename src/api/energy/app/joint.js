import request from '@/utils/request'

/**
 * 以下为能耗综合查询接口 
 */

// 区域统计（左侧统计）
export function energyByArea(query) {
    return request({
        url: '/energy/query/energyJoint/countArea',
        method: 'get',
        params: query
    })
}

// 区域查询列表
export function energyByAreaRit(query) {
    return request({
        url: '/energy/query/energyJoint/listArea',
        method: 'get',
        params: query
    })
}

// 部门统计（左侧统计）
export function energyByDept(query) {
    return request({
        url: '/energy/query/energyJoint/countDept',
        method: 'get',
        params: query
    })
}

// 部门查询列表
export function energyByDeptRit(query) {
    return request({
        url: '/energy/query/energyJoint/listDept',
        method: 'get',
        params: query
    })
}