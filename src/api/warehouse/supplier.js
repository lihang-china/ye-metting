import request from '@/utils/request'

// 查询供应商管理 列表
export function listSupplier(query) {
  return request({
    url: '/warehouse/supplier/list',
    method: 'get',
    params: query
  })
}

// 查询供应商管理 详细
export function getSupplier(supId) {
  return request({
    url: '/warehouse/supplier/' + supId,
    method: 'get'
  })
}

// 新增供应商管理 
export function addSupplier(data) {
  return request({
    url: '/warehouse/supplier',
    method: 'post',
    data: data
  })
}

// 修改供应商管理 
export function updateSupplier(data) {
  return request({
    url: '/warehouse/supplier',
    method: 'put',
    data: data
  })
}

// 删除供应商管理 
export function delSupplier(supId) {
  return request({
    url: '/warehouse/supplier/' + supId,
    method: 'delete'
  })
}

// 导出供应商管理 
export function exportSupplier(query) {
  return request({
    url: '/warehouse/supplier/export',
    method: 'get',
    params: query
  })
}