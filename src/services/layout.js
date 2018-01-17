import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getLayout (params) {
  return request(`${apiBase}/api/layouts`,{
    headers: { "Authorization": token },
  })
}
