import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getList (params) {
  return request(`${apiBase}/api/docfeetypes`,{
    headers: { "Authorization": token() },
  })
}

export async function deleteSingle (params) {
  return request(`${apiBase}/api/docfeetypes/${params.id}`,{
    method: 'DELETE',
    headers: { "Authorization": token() },
  })
}

export async function createSingle (params) {
  params.name = params.name.trim();
  params.percent == 0 ? params.value = 1 : params.value = 0;
  return request(`${apiBase}/api/docfeetypes/`,{
    method: 'POST',
    headers: { "Authorization": token() },
    body: params,
  })
}

export async function editSingle (params) {
  params.name = params.name.trim();
  params.percent == 0 ? params.value = 1 : params.value = 0;
  const current = {...params}
  delete current.id
  return request( `${apiBase}/api/docfeetypes/${params.id}`,{
    method: 'PUT',
    headers: { "Authorization": token() },
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
  return request(`${apiBase}/api/docfeetypes/sort/`,{
    method: 'PUT',
    headers: { "Authorization": token() },
    body: current,
  })
}