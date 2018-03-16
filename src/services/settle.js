import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getList (params) {
  return request(`${apiBase}/api/statements/list`,{
    method:'POST',
    headers: { "Authorization": token() },
    body:params
  })
}

export async function getSingle (params) {
  return request(`${apiBase}/api/statements/${params.id}`,{
    headers: { "Authorization": token() },
  })
}