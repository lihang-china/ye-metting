import request from '@/utils/request'

export function listCalendars(query) {
  return request({
    url: '/equipment/calendars',
    method: 'get',
    params: query
  })
}

export function getCalendars(jobCalendarId) {
  return request({
    url: '/equipment/calendars/' + jobCalendarId,
    method: 'get'
  })
}

export function addCalendars(data) {
  return request({
    url: '/equipment/calendars',
    method: 'post',
    data: data
  })
}

export function updateCalendars(jobCalendarId, data) {
  return request({
    url: '/equipment/calendars/' + jobCalendarId,
    method: 'put',
    data: data
  })
}

export function getWeek(jobCalendarId) {
  return request({
    url: '/equipment/equWeeks',
    method: 'get',
    params: {
      equJobCalendarId: jobCalendarId
    }
  })
}

export function saveWeek(jobCalendarId, data) {
  return request({
    url: '/equipment/calendars/' + jobCalendarId + '/equWeeks',
    method: 'post',
    data: data
  })
}

export function getYear(jobCalendarId) {
  return request({
    url: '/equipment/equYears',
    method: 'get',
    params: {
      equJobCalendarId: jobCalendarId
    }
  })
}

export function saveYear(jobCalendarId, data) {
  return request({
    url: '/equipment/calendars/' + jobCalendarId + '/equYears',
    method: 'post',
    data: data
  })
}