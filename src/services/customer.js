import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getList (params) {
  return request(`${apiBase}/api/customers/list`, {
    method: 'POST',
    headers: { "Authorization": token },
    body: params
  })
}

export async function deleteSingle (params) {
  let current = {
    customer_ids:[params]
  }
  return request(`${apiBase}/api/customers`, {
    method: 'DELETE',
    headers: { "Authorization": token },
    body: current
  })
}

export async function changeCustomerStatus (params) {
  let current = {
    freeze: params.freeze
  }
  return request(`${apiBase}/api/customers/${params.id}/freeze`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body:current
  })
}

export async function getSingle (params) {
  return request(`${apiBase}/api/customers/${params.id}`, {
    headers: { "Authorization": token },
  }) 
}

export async function getCustomerfinance (params) {
  return request(`${apiBase}/api/customers/${params.id}/finance`,{
    headers: { "Authorization": token },
  })
}

export async function getCustomerSaleHistory (params) {
  let current = {...params};
  delete current.id
  if(current.filter) {
    current = current.filter
  }
  return request(`${apiBase}/api/customers/${params.id}/salesorders`, {
    method: 'POST',
    headers: {"Authorization":token},
    body:current
  })
}

export async function getCustomerGoodsHistory (params) {
  let current = {...params};
  delete current.id
  if(current.filter) {
    current = current.filter
  }
  return request(`${apiBase}/api/customers/${params.id}/items`, {
    method: 'POST',
    headers: {"Authorization":token},
    body: current
  })
}

export async function getCustomerPaymentHistory (params) {
  let current = {...params};
  delete current.id
  if(current.filter) {
    current = current.filter
  }
  return request(`${apiBase}/api/customers/${params.id}/payments`,{
    method: 'POST',
    headers: {"Authorization":token},
    body: current
  })
}

export async function getGoodsPurchaseDetail (params) {
  return request(`${apiBase}/api/customers/${params.id}/item/${params.subId}/statistics`,{
    method: 'POST',
    headers: {"Authorization":token},
  })
}

export async function createSingle (params) {
  return request(`${apiBase}/api/customers` ,{
    method: 'POST',
    headers: { "Authorization": token },
    body: params,
  }) 
}

// export async function editSingle (params) {
//   return request({
//     url: `${apiBase}/api/customers/${params.id}`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: params,
//   })
// }

