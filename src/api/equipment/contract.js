import request from '@/utils/request'

// 查询设备合同列表
export function listContract(query) {
  return request({
    url: '/equipment/contract/list',
    method: 'get',
    params: query
  })
}

// 查询设备合同列表 全部
export function listContractAll(query) {
  return request({
    url: '/equipment/contract/list/all',
    method: 'get',
    params: query
  })
}

// 查询设备合同详细
export function getContract(conId) {
  return request({
    url: '/equipment/contract/' + conId,
    method: 'get'
  })
}

// 查询设备合同详细
export function getContractByGuid(conGuid) {
  return request({
    url: '/equipment/contract/getContractByGuid/' + conGuid,
    method: 'get'
  })
}

// 新增设备合同
export function addContract(data) {
  return request({
    url: '/equipment/contract',
    method: 'post',
    data: data
  })
}

// 修改设备合同
export function updateContract(data) {
  return request({
    url: '/equipment/contract',
    method: 'put',
    data: data
  })
}

// 删除设备合同
export function delContract(conId) {
  return request({
    url: '/equipment/contract/' + conId,
    method: 'delete'
  })
}

// 导出设备合同
export function exportContract(query) {
  return request({
    url: '/equipment/contract/export',
    method: 'get',
    params: query
  })
}