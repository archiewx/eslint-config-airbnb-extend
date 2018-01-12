import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getListSales (params) {
  return request(`${apiBase}/api/items/sales`,{
    method: 'POST',
    headers: { "Authorization": token },
    data: params
  })
}

export async function getListPurchase (params) {
  return request(`${apiBase}/api/items/purchase`,{
    method: 'POST',
    headers: { "Authorization": token },
    data: params
  })
}