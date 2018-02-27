import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getList (params) {
  return request(`${apiBase}/api/units`, {
    headers: { "Authorization": token },
  })
}

export async function deleteSingle (params) {
  return request(`${apiBase}/api/units/${params.id}`,{
    method: 'DELETE',
    headers: { "Authorization": token },
  })
}

export async function createSingle (params) {
  params.name = params.name.trim();
  return request(`${apiBase}/api/units`,{
    method: 'POST',
    headers: { "Authorization": token },
    body: params,
  })
}

export async function editSingle (params) {
  params.name = params.name.trim();
  const current = {...params}
  delete current.id
  return request(`${apiBase}/api/units/${params.id}`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body: current,
  })
}

export async function editSort (params) {
  const current = params.map( n => {
    return {
      id: n.id,
      sort:n.sort
    }
  })
  return request(`${apiBase}/api/units/sort`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body: current,
  })
}