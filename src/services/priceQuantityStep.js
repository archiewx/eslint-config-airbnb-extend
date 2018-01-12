import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getList (params) {
  return request(`${apiBase}/api/quantityrangegroups?include=quantityranges`,{
    headers: { "Authorization": token },
  })
}

// export async function deleteSingle (params) {
//   return request({
//     url: `${apiBase.duoke}/api/quantityrangegroups/${params.id}`,
//     method: 'delete',
//     headers: { "Authorization": token },
//     data: params,
//   })
// }

// export async function createSingle (params) {
//   const e = {
//     quantityranges: params
//   }
//   return request({
//     url: `${apiBase.duoke}/api/quantityrangegroups/`,
//     method: 'post',
//     headers: { "Authorization": token },
//     data: e,
//   })
// }