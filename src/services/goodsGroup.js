import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getListGroup (params) {
  return request(`${apiBase}/api/itemgroups`, {
    headers: { "Authorization": token },
  })
}

// export async function deleteSingleGroup (params) {
//   return request({
//     url: `${apiBase.duoke}/api/itemgroups/${params.id}`,
//     method: 'delete',
//     headers: { "Authorization": token },
//     data: params,
//   })
// }

// export async function createSingleGroup (params) {
//   params.name = params.name.trim();
//   return request({
//     url: `${apiBase.duoke}/api/itemgroups/`,
//     method: 'post',
//     headers: { "Authorization": token },
//     data: params,
//   })
// }

// export async function editSingleGroup (params) {
//   params.name = params.name.trim();
//   return request({
//     url: `${apiBase.duoke}/api/itemgroups/${params.id}`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: params,
//   })
// }

// export async function getListEntry (params) {
//   return request({
//     url: `${apiBase.duoke}/api/itemgroups/${params.id}`,
//     method: 'get',
//     headers: { "Authorization": token },
//     data: '',
//   })
// }

// export async function deleteSingleEntry (params) {
//   return request({
//     url: `${apiBase.duoke}/api/itemgroups/${params.id}`,
//     method: 'delete',
//     headers: { "Authorization": token },
//     data: params,
//   })
// }

// export async function createSingleEntry (params) {
//   params.name = params.name.trim();
//   return request({
//     url: `${apiBase.duoke}/api/itemgroups/`,
//     method: 'post',
//     headers: { "Authorization": token },
//     data: params,
//   })
// }

// export async function editSingleEntry (params) {
//   params.name = params.name.trim();
//   return request({
//     url: `${apiBase.duoke}/api/itemgroups/${params.id}`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: params,
//   })
// }

// export async function deleteBatchSome (params) {
//   let e = params.selectItemList.join(',');
//   return request({
//     url: `${apiBase.duoke}/api/itemgroups/${e}/batch`,
//     method: 'delete',
//     headers: { "Authorization": token },
//     data: params,
//   })
// }

// export async function editListSort (params) {
//   return request({
//     url: `${apiBase.duoke}/api/itemgroups/sort/`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: params,
//   })
// }
