import request from '@/utils/request'

// 查询能耗地理区域列表
//locationId energyType
export function collectList(params) {
  return request({
    url: '/energy/query/energyCollect/list',
    method: 'get',
    params
  })
}