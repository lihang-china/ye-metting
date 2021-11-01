import request from '@/utils/request'

// 查询能耗地理区域列表
//locationId energyType
export function costAccountingList(params) {
  return request({
    url: '/energy/cost/costCount/list',
    method: 'get',
    params
  })
}

export function settingList(startYear) {
  return request({
    url: `/energy/cost/price/settingList/${startYear}`,
    method: 'get'
  })
}

export function saveSetting(param) {
  return request({
    url: "/energy/cost/price/saveSetting",
    method: "post",
    data: param
  })
}
