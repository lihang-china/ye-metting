import request from '@/utils/request'

/**
 * 以下为能耗基础接口 
 */

 // 根据能耗类型获取分项根目录
export function getItemRoot(type) {
    return request({
        url: '/energy/basic/item/listRoot/'+type,
        method: 'get'
    })
}

 // 根据能耗类型获取分项所有
 export function getItemAll(type) {
    return request({
        url: '/energy/basic/item/listAll/'+type,
        method: 'get'
    })
}