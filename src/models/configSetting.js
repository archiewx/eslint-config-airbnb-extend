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
    inventoryApprover:[],
    itemAttribute:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({pathname})=>{
        if(location.hash.indexOf('/user/login') == -1) {
          if(sessionStorage.getItem('oncefetch') == 'true') {
            dispatch({type:'getConfigSetting'})
            sessionStorage.setItem('oncefetch',false)
          }
        }
      })
    },
  },

  effects: {
    *getConfigSetting({payload},{call,put}) {
      const data = yield call(configSettingService.getConfigSetting)
      yield put({type:'setConfigSetting',payload:data.result.data})
    },

    *switchUsePrice({payload},{call,put}) {
      yield call(configSettingService.switchUsePrice,payload)
    },

    *switchHistoryPrice({payload},{call,put}) {
      yield call(configSettingService.switchHistoryPrice,payload)
    },

    *switchPriceModal({payload},{call,put}) {
      yield call(configSettingService.switchPriceModal,payload)
    },

    *switchBarcode({payload},{call,put}) {
      yield call(configSettingService.switchBarcode,payload)
    },

    *switchPicture({payload},{call,put}) {
      yield call(configSettingService.switchPicture,payload)
    },

    *switchShopShareCustomer({payload},{call,put}){
      yield call(configSettingService.switchShopShareCustomer,payload)
    },

    *switchShopShareCustomer({payload},{call,put}) {
      yield call(configSettingService.switchShopShareCustomer,payload)
    },

    *switchItemAttrite({payload},{call,put}) {
      yield call(configSettingService.switchItemAttrite,payload)
    },

    *switchDefaultDeleiverWay({payload},{call,put}) {
      yield call(configSettingService.switchDefaultDeleiverWay,payload)
    },

    *switchInventoryApprover({payload},{call,put}) {
      yield call(configSettingService.switchInventoryApprover,payload)
    },

  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setConfigSetting (state,{payload}) {
      const allConfigSetting = _.keyBy(payload,'name')
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
      state.inventoryApprover = allConfigSetting['inventory_approver'].setting.apply
      state.itemAttribute = allConfigSetting['item_attribute'].setting.apply
      return {...state}
    }

  },

};
