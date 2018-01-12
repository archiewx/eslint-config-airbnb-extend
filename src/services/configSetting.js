import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getConfigSetting (params) {
  return request(`${apiBase}/api/configs/list`,{
    method: 'POST',
    headers: { "Authorization": token },
  })
}

// export async function switchBarCodeMap (params) {
//   const e = {
//     setting:[params],
//   };
//   return request({
//     url: `${apiBase.duoke}/api/configs/item_barcode_level/setting`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: e,
//   })
// }

// export async function switchPictureMap (params) {
//   const e = {
//     setting:[params],
//   };
//   return request({
//     url: `${apiBase.duoke}/api/configs/item_image_level/setting`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: e,
//   })
// }

// export async function switchHistoryPriceMap (params) {
//   const e = {
//     setting:[params],
//   };
//   return request({
//     url: `${apiBase.duoke}/api/configs/use_history_price/setting`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: e,
//   })
// }

// export async function switchShopShareCustomerMap (params) {
//   const e = {
//     setting:[params],
//   };
//   return request({
//     url: `${apiBase.duoke}/api/configs/shop_share_customer/setting`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: e,
//   })
// }

// export async function switchDeliveryMap (params) {
//   const e = {
//     setting:[params],
//   };
//   return request({
//     url: `${apiBase.duoke}/api/configs/default_delivery_way/setting`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: e,
//   })
// }

// export async function switchReturnGoodsMap (params) {
//   const e = {
//     setting:[params],
//   };
//   return request({
//     url: `${apiBase.duoke}/api/configs/allow_return/setting`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: e,
//   })
// }

// export async function switchTransportPayerMap (params) {
//   const e = {
//     setting:[params],
//   };
//   return request({
//     url: `${apiBase.duoke}/api/configs/default_transport_fee_payer/setting`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: e,
//   })
// }

// export async function switchTransportSettleMap (params) {
//   const e = {
//     setting:[params],
//   };
//   return request({
//     url: `${apiBase.duoke}/api/configs/default_transport_fee_settle/setting`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: e,
//   })
// }

// export async function switchPriceStateMap (params) {
//   const e = {
//     setting:[params],
//   };
//   return request({
//     url: `${apiBase.duoke}/api/configs/use_pricelevel/setting`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: e,
//   })
// }

// export async function switchBasicPriceMap (params) {
//   const e = {
//     setting:[params],
//   };
//   return request({
//     url: `${apiBase.duoke}/api/configs/price_model/setting`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: e,
//   })
// }

// export async function switchApproverMap (params) {
//   const e = {
//     setting:params
//   }
//   return request({
//     url: `${apiBase.duoke}/api/configs/inventory_approver/setting`,
//     method: 'put',
//     headers: { "Authorization": token },
//     data: e,
//   })
// }
