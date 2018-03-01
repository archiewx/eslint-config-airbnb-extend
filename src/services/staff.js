import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getList (params) {
  return request(`${apiBase}/api/staffs?dimission=0`, {
    headers: { "Authorization": token() },
  })
}
