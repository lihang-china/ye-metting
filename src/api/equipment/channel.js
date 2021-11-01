import request from '@/utils/request'

// 查询设备位号列表
export function listChannel(query) {
  return request({
    url: '/equipment/channel/list',
    method: 'get',
    params: query
  })
}

// 查询设备位号列表(不带权限校验)
export function listSelectChannel(query) {
  return request({
    url: '/equipment/channel/list/select',
    method: 'get',
    params: query
  })
}

// 查询设备位号详细
export function getChannel(channelId) {
  return request({
    url: '/equipment/channel/' + channelId,
    method: 'get'
  })
}

// 查询设备位号详细
export function getChannelByCode(channelCode) {
  return request({
    url: '/equipment/channel/code/' + channelCode,
    method: 'get'
  })
}

// 新增设备位号
export function addChannel(data) {
  return request({
    url: '/equipment/channel',
    method: 'post',
    data: data
  })
}

// 修改设备位号
export function updateChannel(data) {
  return request({
    url: '/equipment/channel',
    method: 'put',
    data: data
  })
}

// 开启/关闭报警 
export function openEvent(data) {
  return request({
    url: '/equipment/channel/openevent',
    method: 'put',
    data: data
  })
}

// 删除设备位号
export function delChannel(channelId, equId) {
  return request({
    url: '/equipment/channel/' + channelId + '/' + equId,
    method: 'delete'
  })
}

// 导出设备位号
export function exportChannel(query) {
  return request({
    url: '/equipment/channel/export',
    method: 'get',
    params: query
  })
}

// 导出设备位号
export function exportCsv(query) {
  return request({
    url: '/equipment/channel/export/csv',
    method: 'get',
    params: query
  })
}

// 查询设备位号列表（设备模板）
export function listTempletChannel(query) {
  return request({
    url: '/equipment/channel/listTemplet',
    method: 'get',
    params: query
  })
}

// 新增设备位号（设备模板）
export function addTempletChannel(data) {
  return request({
    url: '/equipment/channel/addTemplet',
    method: 'post',
    data: data
  })
}

// 修改设备位号（设备模板）
export function updateTempletChannel(data) {
  return request({
    url: '/equipment/channel/editTemplet',
    method: 'put',
    data: data
  })
}

// 删除设备位号（设备模板）
export function delTempletChannel(channelId, templetId) {
  return request({
    url: '/equipment/channel/removeTemplet/' + channelId + '/' + equId,
    method: 'delete'
  })
}

// 导出设备位号（设备模板）
export function exportTempletChannel(query) {
  return request({
    url: '/equipment/channel/exportTemplet',
    method: 'get',
    params: query
  })
}