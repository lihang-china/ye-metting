import request from '@/utils/request'

// 查询库房管理 列表
export function listRoom(query) {
  return request({
    url: '/warehouse/room/list',
    method: 'get',
    params: query
  })
}

// 查询库房管理 全部
export function listRoomAll(query) {
  return request({
    url: '/warehouse/room/list/all',
    method: 'get',
    params: query
  })
}

// 查询库房管理 详细
export function getRoom(roomId) {
  return request({
    url: '/warehouse/room/' + roomId,
    method: 'get'
  })
}

// 新增库房管理 
export function addRoom(data) {
  return request({
    url: '/warehouse/room',
    method: 'post',
    data: data
  })
}

// 修改库房管理 
export function updateRoom(data) {
  return request({
    url: '/warehouse/room',
    method: 'put',
    data: data
  })
}

// 删除库房管理 
export function delRoom(roomId) {
  return request({
    url: '/warehouse/room/' + roomId,
    method: 'delete'
  })
}

// 导出库房管理 
export function exportRoom(query) {
  return request({
    url: '/warehouse/room/export',
    method: 'get',
    params: query
  })
}