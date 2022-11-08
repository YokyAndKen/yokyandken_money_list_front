import service from './request'

export function get(url: string, params: any, responseType?: string = 'json') {
  return service({
    method: 'GET',
    url,
    params,
    responseType
  })
}

export function post(url: string, data: any, responseType?: string = 'json') {
  return service({
    method: 'POST',
    url,
    data,
    responseType
  })
}