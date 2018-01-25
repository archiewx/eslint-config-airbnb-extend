import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getList (params) {
  return request(`${apiBase}/api/suppliers/list`, {
    method: 'POST',
    headers: { "Authorization": token },
    body: params
  })
}

export async function deleteSingle (params) {
  return request(`${apiBase}/api/suppliers/${params}`,{
    method: 'DELETE',
    headers: { "Authorization": token },
  })
}

export async function changeSupplierStatus (params) {
  let current = {
    freeze: params.freeze
  }
  return request(`${apiBase}/api/suppliers/${params.id}/freeze`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body:current
  })
}

// export async function createSingle (params) {
//   return request({
//     url: `${apiBase.duoke}/api/suppliers`,
//     method: 'post',
//     headers: { "Authorization": token },
//     data: params,
//   })
// }

// export async function getSingle (params) {
//   return request({
//     url: `${apiBase.duoke}/api/suppliers/${params.id}`,
//     method: 'get',
//     headers: { "Authorization": token },
//     data: params,
//   })
// }


// export async function editSingle (params) {
//   return request({
//     url: `${apiBase.duoke}/api/suppliers/${params.id}`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: params,
//   })
// }

// export async function getSupplierSaleHistory (params) {
//   let e = null;
//   params == null ? '' : (e={sorts:params.sorts})
//   return request({
//     url: `${apiBase.duoke}/api/suppliers/${params.id}/purchaseorders`,
//     method: 'post',
//     headers: {"Authorization":token},
//     data:e,
//   })
// }

// export async function getSupplierGoodsHistory (params) {
//   let e = null;
//   params == null ? '' : (e={sorts:params.sorts})
//   return request({
//     url: `${apiBase.duoke}/api/suppliers/${params.id}/items`,
//     method: 'post',
//     headers: {"Authorization":token},
//     data:e,
//   })
// }

// export async function getSupplierPaymentHistory (params) {
//   let e = null;
//   params == null ? '' : (e={sorts:params.sorts})
//   return request({
//     url: `${apiBase.duoke}/api/suppliers/${params.id}/payments`,
//     method: 'post',
//     headers: {"Authorization":token},
//     data:e,
//   })
// }