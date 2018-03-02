import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function printSaleOrder (params) {
  return request(`${apiBase}/api/print/salesorder`,{
    method:'POST',
    headers: { "Authorization": token() },
    body:params
  })
}