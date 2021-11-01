import request from '@/utils/request'

export function save(data) {
  return request({
    url: '/patrol/linechildren',
    method: 'post',
    data: data
  })
}

export function remove(data) {
    return request({
      url: '/patrol/linechildren',
      method: 'delete',
      data: data
    })
  }