import request from '@/utils/request'


export function listTimeJobs(query) {
  return request({
    url: '/equipment/timeJobs',
    method: 'get',
    params: query
  })
}

export function getTimeJobs(equTimeJobId) {
  return request({
    url: '/equipment/timeJobs/' + equTimeJobId,
    method: 'get'
  })
}

export function addTimeJobs(jobCalendarId, data) {
  return request({
    url: '/equipment/calendars/' + jobCalendarId + '/timeJobs',
    method: 'post',
    data: data
  })
}

export function updateTimeJobs(equTimeJobId, data) {
  return request({
    url: '/equipment/timeJobs/' + equTimeJobId,
    method: 'put',
    data: data
  })
}

export function delTimeJobs(equTimeJobIds) {
  return request({
    url: '/equipment/timeJobs/' + equTimeJobIds,
    method: 'delete'
  })
}

export function getChannels(query){
  return request({
    url: '/equipment/channelSelecteds',
    method: 'get',
    params: query
  })
}

export function getChannelsWithSelectedTag(query) {
  return request({
    url: '/equipment/channelSelecteds/selectedTag',
    method: 'get',
    params: query
  })
}

export function addChannels(jobCalendarId, equTimeJobId, data) {
  return request({
    url: '/equipment/calendars/' + jobCalendarId + '/timeJobs/' + equTimeJobId + '/channelSelecteds',
    method: 'post',
    data: data
  })
}

export function addChannelsCategory(data){
  return request({
    url: '/equipment/channelSelecteds',
    method: 'post',
    data: data
  })
}

export function updateChannels(data) {
  return request({
    url: '/equipment/calendars/timeJobs/channelSelecteds',
    method: 'put',
    data: data
  })
}