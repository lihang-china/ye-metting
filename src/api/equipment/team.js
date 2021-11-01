import request from '@/utils/request'

// 查询班组管理 列表
export function listTeam(query) {
  return request({
    url: '/equipment/team/list',
    method: 'get',
    params: query
  })
}

// 查询班组管理 详细
export function getTeam(teamId) {
  return request({
    url: '/equipment/team/' + teamId,
    method: 'get'
  })
}

// 新增班组管理 
export function addTeam(data) {
  return request({
    url: '/equipment/team',
    method: 'post',
    data: data
  })
}

// 修改班组管理 
export function updateTeam(data) {
  return request({
    url: '/equipment/team',
    method: 'put',
    data: data
  })
}

// 删除班组管理 
export function delTeam(teamId) {
  return request({
    url: '/equipment/team/' + teamId,
    method: 'delete'
  })
}

// 导出班组管理 
export function exportTeam(query) {
  return request({
    url: '/equipment/team/export',
    method: 'get',
    params: query
  })
}

//启用/停用班组
export function changeTeamStatus(teamId, status){
  const data = {
    teamId,
    status
  }
  return request({
    url: '/equipment/team/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询班组树型列表
export function treeListTeam(query) {
  return request({
    url: '/equipment/team/treeselect',
    method: 'get',
    params: query
  })
}