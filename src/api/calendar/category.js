import request from '@/utils/request'

// 查询场景分类列表
export function listCategory(query) {
  return request({
    url: '/equipment/scenesCategories',
    method: 'get',
    params: query
  })
}

// 查询场景分类详细
export function getCategory(id) {
  return request({
    url: '/equipment/scenesCategories/' + id,
    method: 'get'
  })
}

// 新增场景分类
export function addCategory(data) {
  return request({
    url: '/equipment/scenesCategories',
    method: 'post',
    data: data
  })
}

// 修改场景分类
export function updateCategory(id, data) {
  return request({
    url: '/equipment/scenesCategories/' + id,
    method: 'put',
    data: data
  })
}

// 删除场景分类
export function delCategory(ids) {
  return request({
    url: '/equipment/scenesCategories/' + ids,
    method: 'delete'
  })
}

// 查询场景分类树
export function treeListCategory(query) {
  return request({
    url: '/equipment/scenesCategories/treeSelect',
    method: 'get',
    params: query
  })
}
