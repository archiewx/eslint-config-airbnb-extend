import * as customerService from '../services/customer'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'customerDetail',

  state: {
    singleCustomerDetail: {},
    singleCustomerFinance:[],
    singleCustomerSaleHistory:[],
    singleCustomerGoodsHistory:[],
    singleCustomerPaymentHistory:[],
    saleHistoryFilter:[],
    goodsHistoryFilter:[],
    paymentHistoryFilter:[],
    filterSaleServerData:{},
    filterGoodsServerData:{},
    filterPaymentServerData:{},
    currentId:'',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/relationship/customer-detail/:id').exec(location.hash.slice(1,location.hash.length))
        if(match) {
          dispatch({type:'getSingle',payload:{id:match[1]}})
        }
      })
    },
  },

  effects: {
    *getSingle({payload},{call,put,all}) {
      const saleOrPaymentPayload = {
        id:payload.id,
        sorts:{
          created_at:'desc'
        }
      }
      const [data1,data2,data3,data4,data5] = yield all([
        call(customerService.getSingle,payload),
        call(customerService.getCustomerfinance,payload),
        call(customerService.getCustomerSaleHistory,saleOrPaymentPayload),
        call(customerService.getCustomerGoodsHistory,payload),
        call(customerService.getCustomerPaymentHistory,saleOrPaymentPayload)
      ])

      yield put({type:'setShowData',payload:data1.result.data})
      yield put({type:'setState',payload:{
        singleCustomerSaleHistory:data3.result.data,
        singleCustomerGoodsHistory:data4.result.data,
        singleCustomerPaymentHistory:data5.result.data,
        saleHistoryFilter: data3.result.meta.filter.groups,
        goodsHistoryFilter: data4.result.meta.filter.groups,
        paymentHistoryFilter: data5.result.meta.filter.groups,
        currentId: payload
      }})
    },

    *getSingleDetail({payload},{call,put}) {
      const data = yield call(customerService.getSingle,payload)
      yield put({type:'setShowData',payload:data.result.data})
    },

    *getSaleHistory({payload},{call,put}) {
      const data = yield call(customerService.getCustomerSaleHistory,payload)
      yield put({type:'setState',payload:{
        singleCustomerSaleHistory: data.result.data
      }})
    },

    *getGoodsHistory({payload},{call,put}) {
      const data = yield call(customerService.getCustomerGoodsHistory,payload)
      yield put({type:'setState',payload:{
        singleCustomerGoodsHistory: data.result.data
      }})
    },

    *getPaymentHistory({payload},{call,put}) {
      const data = yield call(customerService.getCustomerPaymentHistory,payload)
      yield put({type:'setState',payload:{
        singleCustomerPaymentHistory:data.result.data
      }})
    },

    *deleteSingle({payload},{call,put}) {
      const data = yield call(customerService.deleteSingle,payload)
    },

    *changeCustomerStatus({payload},{call,put,select}) {
      const data = yield call(customerService.changeCustomerStatus,payload)
      const {currentId} = yield select(({customerDetail}) => customerDetail)
      yield put({type:'getSingleDetail',payload:currentId})
    },

  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setShowData (state,{payload}) {
      state.singleCustomerDetail.name = payload.name;
      state.singleCustomerDetail.phone = payload.phone;
      state.singleCustomerDetail.remark1 = payload.remark1;
      state.singleCustomerDetail.total_points = payload.total_points;
      state.singleCustomerDetail.wechat = payload.wechat;
      state.singleCustomerDetail.seller = payload.seller ? payload.seller.data.name : ''
      state.singleCustomerDetail.freeze = payload.freeze;
      state.singleCustomerDetail.addresses = payload.addresses.data;
      state.singleCustomerDetail.default = payload.default;
      return {...state}
    },


    setFilterSaleServerData (state,{payload}) {
      let current = {}
      for(let key in payload) {
        if(key.indexOf('sale_') == 0) {
          if(payload[key]) {
            let name = key.slice(5,key.length)
            if(name == 'datePick') {
              current['data_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      state.filterSaleServerData = current
      return {...state}
    },

    setFilterGoodsServerData (state,{payload}) {
      let current = {}
      for(let key in payload) {
        if(key.indexOf('goods_') == 0) {
          if(payload[key]) {
            let name = key.slice(6,key.length)
            if(name == 'datePick') {
              current['data_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      state.filterGoodsServerData = current
      return {...state}
    },

    setFilterPurchaseServerData (state,{payload}) {
      let current = {}
      for(let key in payload) {
        if(key.indexOf('payment_') == 0) {
          if(payload[key]) {
            let name = key.slice(8,key.length)
            if(name == 'datePick') {
              current['data_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      state.filterPaymentServerData = current
      return {...state}
    }
  },

};
