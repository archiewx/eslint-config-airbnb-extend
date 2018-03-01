import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getList (params) {
  return request( `${apiBase}/api/shops`, {
    headers: { "Authorization": token() },
  })
}

export async function editWarehouse(params) {
  const current = {...params}
  delete current.id;
  return request( `${apiBase}/api/shops/${params.id}/warehouses`,{
    headers:{'Authorization':token()},
    method:'PUT',
    body:current.warehouse_id
  })
}

export async function editItem(params) {
  const current = {...params}
  delete current.id;
  return request( `${apiBase}/api/shops/${params.id}/itemgroups`,{
    headers:{'Authorization':token()},
    method:'PUT',
    body:current.item_id
  })
}
// export async function editSingle (params) {
//   params.name = params.name.trim();
//   return request({
//     url: `${apiBase.duoke}/api/shops/${params.id}`,
//     method: 'put',
//     headers: { "Authorization": token() },
//     data: params,
//   })
// }