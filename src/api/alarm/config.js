import request from '@/utils/request'

// 查询报警配置列表
export function listConfig(query) {
  return request({
    url: '/alarm/alarmConfigs',
    method: 'get',
    params: query
  })
}

// 查询报警配置详细
export function getConfig(id) {
  return request({
    url: '/alarm/alarmConfigs/' + id,
    method: 'get'
  })
}

// 新增报警配置
export function addConfig(data) {
  return request({
    url: '/alarm/alarmConfigs',
    method: 'post',
    data: data
  })
}

// 修改报警配置
export function updateConfig(id, data) {
  return request({
    url: '/alarm/alarmConfigs/' + id,
    method: 'put',
    data: data
  })
}

// 删除报警配置
export function delConfig(id) {
  return request({
    url: '/alarm/alarmConfigs/' + id,
    method: 'delete'
  })
}

export function getChannels() {
  return request({
    url: '/alarm/alarmConfigs/channelIds',
    method: 'get'
  })
}