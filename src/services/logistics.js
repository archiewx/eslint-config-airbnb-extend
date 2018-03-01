import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getList (params) {
  return request(`${apiBase}/api/transportways`,{
    headers: { "Authorization": token() },
  })
}

export async function deleteSingle (params) {
  return request(`${apiBase}/api/transportways/${params.id}`,{
    method: 'DELETE',
    headers: { "Authorization": token() },
  })
}

export async function createSingle (params) {
  params.name = params.name.trim();
  return request(`${apiBase}/api/transportways`, {
    method: 'POST',
    headers: { "Authorization": token() },
    body: params,
  })
}

export async function editSingle (params) {
  params.name = params.name.trim();
  const current = {...params}
  delete current.id
  return request(`${apiBase}/api/transportways/${params.id}`, {
    method: 'PUT',
    headers: { "Authorization": token() },
    body: current,
  })
}

