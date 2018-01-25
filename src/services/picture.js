import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function upload (params) {
  return request(`${apiBase}/api/images`,{
    method: 'POST',
    headers: { "Authorization": token },
    body: params
  })
}
