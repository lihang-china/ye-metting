import request from '@/utils/request'

// 查询设备供应商列表
export function listSupplier(query) {
  return request({
    url: '/equipment/supplier/list',
    method: 'get',
    params: query
  })
}

// 查询设备供应商列表 全部
export function listSupplierAll(query) {
  return request({
    url: '/equipment/supplier/list/all',
    method: 'get',
    params: query
  })
}

// 查询设备供应商详细
export function getSupplier(supId) {
  return request({
    url: '/equipment/supplier/' + supId,
    method: 'get'
  })
}

// 查询设备供应商详细
export function getSupplierByGuid(supGuid) {
  return request({
    url: '/equipment/supplier/getSupplierByGuid/' + supGuid,
    method: 'get'
  })
}

// 新增设备供应商
export function addSupplier(data) {
  return request({
    url: '/equipment/supplier',
    method: 'post',
    data: data
  })
}

// 修改设备供应商
export function updateSupplier(data) {
  return request({
    url: '/equipment/supplier',
    method: 'put',
    data: data
  })
}

// 删除设备供应商
export function delSupplier(supId) {
  return request({
    url: '/equipment/supplier/' + supId,
    method: 'delete'
  })
}

// 导出设备供应商
export function exportSupplier(query) {
  return request({
    url: '/equipment/supplier/export',
    method: 'get',
    params: query
  })
}