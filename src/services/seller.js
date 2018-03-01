import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getList (params) {
  return request(`${apiBase}/api/users/sellers`, {
    headers: { "Authorization": token() },
  })
}
