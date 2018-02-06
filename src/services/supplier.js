import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getList (params) {
  return request(`${apiBase}/api/suppliers/list`, {
    method: 'POST',
    headers: { "Authorization": token },
    body: params
  })
}

export async function deleteSingle (params) {
  return request(`${apiBase}/api/suppliers/${params}`,{
    method: 'DELETE',
    headers: { "Authorization": token },
  })
}

export async function changeSupplierStatus (params) {
  let current = {
    freeze: params.freeze
  }
  return request(`${apiBase}/api/suppliers/${params.id}/freeze`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body:current
  })
}

export async function createSingle (params) {
  return request(`${apiBase}/api/suppliers`, {
    method: 'POST',
    headers: { "Authorization": token },
    body: params,
  })
}

export async function getSingle (params) {
  return request(`${apiBase}/api/suppliers/${params.id}`,{
    headers: { "Authorization": token },
  })
}

export async function editSingle (params) {
  return request(`${apiBase}/api/suppliers/${params.id}`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body: params.serverData,
  })
}

export async function getSupplierSaleHistory (params) {
  let current = {...params};
  delete current.id
  if(current.filter) {
    current = current.filter
  }
  return request(`${apiBase}/api/suppliers/${params.id}/purchaseorders`,{
    method: 'POST',
    headers: {"Authorization":token},
    body: current
  })
}

export async function getSupplierGoodsHistory (params) {
  let current = {...params};
  delete current.id
  if(current.filter) {
    current = current.filter
  }
  return request(`${apiBase}/api/suppliers/${params.id}/items`,{
    method: 'POST',
    headers: {"Authorization":token},
    body: current
  })
}

export async function getSupplierPaymentHistory (params) {
  let current = {...params};
  delete current.id
  if(current.filter) {
    current = current.filter
  }
  return request(`${apiBase}/api/suppliers/${params.id}/payments`,{
    method: 'POST',
    headers: {"Authorization":token},
    body: current
  })
}