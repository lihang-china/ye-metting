import request from '@/utils/request'

// 查询能耗区域配置列表
export function listAreaConfigSetting(query) {
  return request({
    url: '/energy/basic/areaConfig/list/setting',
    method: 'get',
    params: query
  })
}

// 查询能耗区域配置列表
export function listAreaConfig(query) {
  return request({
    url: '/energy/basic/areaConfig/list',
    method: 'get',
    params: query
  })
}

// 查询能耗区域配置详细
export function getAreaConfig(id) {
  return request({
    url: '/energy/basic/areaConfig/' + id,
    method: 'get'
  })
}

// 新增能耗区域配置
export function addAreaConfig(data) {
  return request({
    url: '/energy/basic/areaConfig',
    method: 'post',
    data: data
  })
}

// 修改能耗区域配置
export function updateAreaConfig(data) {
  return request({
    url: '/energy/basic/areaConfig',
    method: 'put',
    data: data
  })
}

// 删除能耗区域配置
export function delAreaConfig(id) {
  return request({
    url: '/energy/basic/areaConfig/' + id,
    method: 'delete'
  })
}

// 导出能耗区域配置
export function exportAreaConfig(query) {
  return request({
    url: '/energy/basic/areaConfig/export',
    method: 'get',
    params: query
  })
}