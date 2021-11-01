import request from '@/utils/request'

// 查询能耗分项列表
export function listItem(query) {
  return request({
    url: '/energy/basic/item/list',
    method: 'get',
    params: query
  })
}

// 查询能耗分项详细
export function getItem(id) {
  return request({
    url: '/energy/basic/item/' + id,
    method: 'get'
  })
}

// 新增能耗分项
export function addItem(data) {
  return request({
    url: '/energy/basic/item',
    method: 'post',
    data: data
  })
}

// 修改能耗分项
export function updateItem(data) {
  return request({
    url: '/energy/basic/item',
    method: 'put',
    data: data
  })
}

// 删除能耗分项
export function delItem(id) {
  return request({
    url: '/energy/basic/item/' + id,
    method: 'delete'
  })
}

// 导出能耗分项
export function exportItem(query) {
  return request({
    url: '/energy/basic/item/export',
    method: 'get',
    params: query
  })
}