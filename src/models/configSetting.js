import * as configSettingService from '../services/configSetting'
import {message} from 'antd'
import _ from 'lodash'
export default  {

  namespace: 'configSetting',

  state: {
    usePricelelvel:'',
    priceModel:'',
    itemBarcodeLevel:'',
    itemImageLevel:'',
    useHistoryPrice:'',
    shopShareCustomer:'',
    defaultDeliveryWay:'',
    allowReturn:'',
    defaultTransportFeePayer:'',
    defaultTransportFeeSettle:'',
    inventoryApprover:[]
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({type:'getConfigSetting'})
    },
  },

  effects: {
    *getConfigSetting({payload},{call,put}) {
      const data = yield call(configSettingService.getConfigSetting)
      yield put({type:'setConfigSetting',payload:data})
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setConfigSetting (state,{payload}) {
      const allConfigSetting = _.keyBy(payload.result.data,'name')
      state.usePricelelvel = allConfigSetting['use_pricelevel'].setting.apply[0]
      state.priceModel = allConfigSetting['price_model'].setting.apply[0]
      state.itemBarcodeLevel = allConfigSetting['item_barcode_level'].setting.apply[0]
      state.itemImageLevel = allConfigSetting['item_image_level'].setting.apply[0]
      state.useHistoryPrice = allConfigSetting['use_history_price'].setting.apply[0]
      state.shopShareCustomer = allConfigSetting['shop_share_customer'].setting.apply[0]
      state.defaultDeliveryWay = allConfigSetting['default_delivery_way'].setting.apply[0]
      state.allowReturn = allConfigSetting['allow_return'].setting.apply[0]
      state.defaultTransportFeePayer = allConfigSetting['default_transport_fee_payer'].setting.apply[0]
      state.defaultTransportFeeSettle = allConfigSetting['default_transport_fee_settle'].setting.apply[0]
      // state.inventoryApprove = allConfigSetting['inventoryApprove'].setting.apply[0]
      return {...state}
    }

  },

};
