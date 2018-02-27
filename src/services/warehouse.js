import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getList (params) {
  return request( `${apiBase}/api/warehouses`, {
    headers: { "Authorization": token },
  })
}

// export async function editSingle (params) {
//   params.name = params.name.trim();
//   return request({
//     url: `${apiBase.duoke}/api/warehouses/${params.id}`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: params,
//   })
// }