import request from '@/utils/request'

// 保存保养计划配置
export function save(data) {
  return request({
    url: '/maintain/planchildren',
    method: 'post',
    data: data
  })
}