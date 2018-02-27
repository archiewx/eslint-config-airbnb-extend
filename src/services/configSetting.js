import {apiBase,token} from '../common/index'
import request from '../utils/request';

export async function getConfigSetting (params) {
  return request(`${apiBase}/api/configs/list`,{
    method: 'POST',
    headers: { "Authorization": token },
  })
}

export async function switchUsePrice (params) {
  const current = {
    setting:[params],
  };
  return request( `${apiBase}/api/configs/use_pricelevel/setting`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body: current,
  })
}

export async function switchHistoryPrice (params) {
  const current = {
    setting:[params],
  };
  return request(`${apiBase}/api/configs/use_history_price/setting`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body: current,
  })
}

export async function switchPriceModal (params) {
  const current = {
    setting:[params],
  };
  return request(`${apiBase}/api/configs/price_model/setting`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body: current,
  })
}

export async function switchBarcode (params) {
  const current = {
    setting:[params],
  };
  return request(`${apiBase}/api/configs/item_barcode_level/setting`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body: current,
  })
}

export async function switchPicture (params) {
  const current = {
    setting:[params],
  };
  return request(`${apiBase}/api/configs/item_image_level/setting`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body: current,
  })
}

export async function switchItemAttrite (params) {
  const current = {
    setting:params,
  }
  return request(`${apiBase}/api/configs/item_attribute/setting`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body: current,
  })
}

export async function switchShopShareCustomer (params) {
  const current = {
    setting:[params],
  };
  return request(`${apiBase}/api/configs/shop_share_customer/setting`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body: current,
  })
}

export async function switchDefaultDeleiverWay (params) {
  const current = {
    setting:[params],
  };
  return request(`${apiBase}/api/configs/default_delivery_way/setting`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body: current,
  })
}


// export async function switchReturnGoodsMap (params) {
//   const e = {
//     setting:[params],
//   };
//   return request({
//     url: `${apiBase}/api/configs/allow_return/setting`,
//     method: 'PUT',
//     headers: { "Authorization": token },
//     body: e,
//   })
// }

// export async function switchTransportPayerMap (params) {
//   const e = {
//     setting:[params],
//   };
//   return request({
//     url: `${apiBase}/api/configs/default_transport_fee_payer/setting`,
//     method: 'PUT',
//     headers: { "Authorization": token },
//     body: e,
//   })
// }

// export async function switchTransportSettleMap (params) {
//   const e = {
//     setting:[params],
//   };
//   return request({
//     url: `${apiBase}/api/configs/default_transport_fee_settle/setting`,
//     method: 'PUT',
//     headers: { "Authorization": token },
//     body: e,
//   })
// }



export async function switchInventoryApprover (params) {
  const current = {
    setting:params
  }
  return request(`${apiBase}/api/configs/inventory_approver/setting`,{
    method: 'PUT',
    headers: { "Authorization": token },
    body: current,
  })
}
