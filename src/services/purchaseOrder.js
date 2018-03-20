import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getList (params) {
  return request(`${apiBase}/api/purchaseorders/list`,{
    method:'POST',
    headers: { "Authorization": token() },
    body:params
  })
}

export async function deleteSingle (params) {
  const current = {...params}
  delete current.id;
  return request(`${apiBase}/api/purchaseorders/${params.id}`,{
    method: 'DELETE',
    headers: { "Authorization": token() },
    body: current
  })
}

export async function getSingle (params) {
  return request(`${apiBase}/api/purchaseorders/${params.id}`,{
    headers: { "Authorization": token() },
  })
}

