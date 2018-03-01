import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getList (params) {
  return request(`${apiBase}/api/users/inventory_approvers`,{
    headers: { "Authorization": token() },
  })
}