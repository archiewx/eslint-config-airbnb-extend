import * as goodsService from '../services/goods'
import moment from 'moment';
export default  {

  namespace: 'goodsList',

  state: {
    goodsListSales: [],
    goodsListPurchases: [],
    goodsSalePagination: {},
    goodsPurchasePagination: {},
    filterSaleServerData: {},
    filterPurchaseServerData: {}
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getGoodsList({payload},{call,put,all}) {
      const [data1,data2] = yield all([call(goodsService.getListSales,payload),call(goodsService.getListPurchase,payload)])
      yield put({type:'setState',payload:{
        goodsListSales:data1.result.data,
        goodsListPurchases:data2.result.data,
        goodsSalePagination: data1.result.meta.pagination,
        goodsPurchasePagination: data2.result.meta.pagination
      }})
    },

    *getGoodsSaleList({payload},{call,put}) {
      const data = yield call(goodsService.getListSales,payload)
      yield put({type:'setState',payload:{
        goodsListSales:data.result.data,
        goodsSalePagination: data.result.meta.pagination,
      }})
    },

    *getGoodsPurchaseList({payload},{call,put}) {
      const data = yield call(goodsService.getListPurchase,payload)
      yield put({type:'setState',payload:{
        goodsListPurchases:data.result.data,
        goodsPurchasePagination: data.result.meta.pagination
      }})
    },

    *changeGoodsStatus({payload},{call,put}) {
      yield call(goodsService.changeGoodsStatus,payload)
    },

    *deleteSingleGoods({payload},{call,put}) {
      yield call(goodsService.deleteSingleGoods,payload)
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setFilterSaleServerData (state,{payload}) {
      let current = {}
      for(let key in payload) {
        if(key.indexOf('sale_') == 0) {
          if(payload[key]) {
            const name = key.slice(5,key.length)
            if(name == 'datePick') {
              current['date_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      for(let key in current) {
        if(Array.isArray(current[key]) && !current[key].length) {
          delete current[key]
        }
      }
      state.filterSaleServerData = current
      return {...state}
    },

    setFilterPurchaseServerData (state,{payload}) {
      let current = {}
      for(let key in payload) {
        if(key.indexOf('purchase_') == 0) {
          if(payload[key]) {
            const name = key.slice(9,key.length)
            if(name == 'datePick') {
              current['date_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      for(let key in current) {
        if(Array.isArray(current[key]) && !current[key].length) {
          delete current[key]
        }
      }
      state.filterPurchaseServerData = current
      return {...state}
    }

  },

};
