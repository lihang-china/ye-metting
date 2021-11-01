import request from '@/utils/request'

// 查询设备档案列表
export function listCard(query) {
  return request({
    url: '/equipment/card/list',
    method: 'get',
    params: query
  })
}

// 查询设备档案列表(设备选择)
export function listCardNo(query) {
  return request({
    url: '/equipment/card/listNo',
    method: 'get',
    params: query
  })
}

// 查询设备档案详细
export function getCard(equId) {
  return request({
    url: '/equipment/card/' + equId,
    method: 'get'
  })
}

// 查询设备档案详细(通过guid)
export function getCardByGuid(equGuid) {
  return request({
    url: '/equipment/card/guid/' + equGuid,
    method: 'get'
  })
}

// 查询设备档案详细(通过code)
export function getCardByCode(equCode) {
  return request({
    url: '/equipment/card/code/' + equCode,
    method: 'get'
  })
}

// 新增设备档案
export function addCard(data) {
  return request({
    url: '/equipment/card',
    method: 'post',
    data: data
  })
}

// 修改设备档案
export function updateCard(data) {
  return request({
    url: '/equipment/card',
    method: 'put',
    data: data
  })
}

// 更新坐标
export function UpdateCoordinate(data) {
  return request({
    url: '/equipment/card/coordinate',
    method: 'put',
    data: data
  })
}

// 删除设备档案
export function delCard(equId) {
  return request({
    url: '/equipment/card/' + equId,
    method: 'delete'
  })
}

// 导出设备档案
export function exportCard(query) {
  return request({
    url: '/equipment/card/export',
    method: 'get',
    params: query
  })
}

export function selectEqu(query) {
  return request({
    url: '/equipment/card/selectEqu',
    method: 'get',
    params: query
  })
}

// 移除设备
export function removeEqu(equIds, type) {
  return request({
    url: '/equipment/card/removeEqu/' + equIds + '/' + type,
    method: 'post'
  })
}

// 添加设备
export function addEqu(equIds, id, type) {
  return request({
    url: '/equipment/card/addEqu/' + equIds + '/' + id + '/' + type,
    method: 'post'
  })
}

//报废报损设备
export function scrapEqu(data) {
  return request({
    url: '/equipment/card/scrapEqu',
    method: 'post',
    data: data
  })
}

//报废报损设备撤销
export function scrapRevoke(equId) {
  return request({
    url: '/equipment/card/scrapRevoke/' + equId,
    method: 'post',
  })
}

export function getScrap(scrId) {
  return request({
    url: '/equipment/card/getScrap/' + scrId,
    method: 'get',
  })
}

export function listByPlan(data) {
  return request({
    url: '/equipment/card/listByPlan',
    method: 'get',
    params: data
  })
}

export function listByParea(query) {
  return request({
    url: '/equipment/card/listByParea',
    method: 'get',
    params: query
  })
}

export function listNoByParea(query) {
  return request({
    url: '/equipment/card/listNoByParea',
    method: 'get',
    params: query
  })
}

//根据系统命名规约查询设备列表
export function getDeviceBySystemIds(query) {
  return request({
    url: '/equipment/card/list/system',
    method: 'get',
    params: query
  })
}

//能源配置 获取设备列表
export function listNhSetting(query) {
  return request({
    url: '/equipment/card/list/nhsetting',
    method: 'get',
    params: query
  })
}

//根据系统命名规约查询设备状态
export function getDeviceStatus(query) {
  return request({
    url: '/equipment/card/list/status',
    method: 'get',
    params: query
  })
}