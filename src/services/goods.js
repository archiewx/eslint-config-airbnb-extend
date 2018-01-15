import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getListSales (params) {
  return request(`${apiBase}/api/items/sales`,{
    method: 'POST',
    headers: { "Authorization": token },
    body: params
  })
}

export async function getListPurchase (params) {
  return request(`${apiBase}/api/items/purchase`,{
    method: 'POST',
    headers: { "Authorization": token },
    body: params
  })
}

export async function changeGoodsStatus (params) {
  let e = {};
  e.not_sale = params.not_sale;
  return request(`${apiBase}/api/items/${params.id}/states`,{
    method: 'PUT',
    headers : {'Authorization': token},
    body: e,
  })
}

export async function createSingle (params) {
  return request(`${apiBase}/api/items`, {
    method: 'POST',
    headers: { "Authorization": token },
    body: params,
  })
}

export async function getSingle (params) {
  return request(`${apiBase}/api/items/${params.id}`,{
    headers: {'Authorization': token}
  })
}

export async function getSingleSales (params) {
  return request (`${apiBase}/api/items/${params.id}/salesorders`, {
    method: 'POST',
    headers : {'Authorization': token},
  })
}

export async function getSinglePurchases (params) {
  return request (`${apiBase}/api/items/${params.id}/purchaseorders`, {
    method: 'POST',
    headers : {'Authorization': token},
  })
}

export async function getSingleCustomers (params) {
  return request (`${apiBase}/api/items/${params.id}/customers`, {
    method: 'POST',
    headers : {'Authorization': token},
  })
}

export async function getSingleSuppliers (params) {
  return request (`${apiBase}/api/items/${params.id}/suppliers`, {
    method: 'POST',
    headers : {'Authorization': token},
  })
}

export async function getSingleStocks (params) {
  return request (`${apiBase}/api/items/${params.id}/stocks`, {
    method: 'POST',
    headers : {'Authorization': token},
  })
}