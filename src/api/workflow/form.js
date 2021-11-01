import request from '@/utils/request'

// 查询表单列表
export function listForm(query) {
  return request({
    url: '/workflow/forms',
    method: 'get',
    params: query
  })
}

// 查询表单列表
export function listFormAll(query) {
  return request({
    url: '/workflow/forms/all',
    method: 'get',
    params: query
  })
}

// 查询表单详细
export function getForm(formId) {
  return request({
    url: '/workflow/forms/' + formId,
    method: 'get'
  })
}

// 新增表单
export function addForm(data) {
  return request({
    url: '/workflow/forms',
    method: 'post',
    data: data
  })
}

// 修改表单
export function updateForm(formId, data) {
  return request({
    url: '/workflow/forms/' + formId,
    method: 'put',
    data: data
  })
}

// 删除表单
export function delForm(formIds) {
  return request({
    url: '/workflow/forms/' + formIds,
    method: 'delete'
  })
}

// 保存表单设计
export function addFormContent(formId, data) {
  return request({
    url: '/workflow/forms/' + formId + '/formContents',
    method: 'put',
    data: data
  })
}

export function getFormContent(formContentId) {
  return request({
    url: '/workflow/formContents/' + formContentId,
    method: 'get'
  })
}

export function submit(url, data) {
  return request({
    url: url,
    method: 'post',
    data: data
  })
}

export function dynamic(url) {
  return request({
    url: url,
    method: 'get'
  })
}
