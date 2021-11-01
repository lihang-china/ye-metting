import request from '@/utils/request'

/**
 * 以下为能耗公示接口 
 */

// 区域用能监测（左侧统计）
export function energyPublicity(query) {
    return request({
        url: '/energy/query/energyCount/display',
        method: 'get',
        params: query
    })
}