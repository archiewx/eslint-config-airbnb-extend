import * as goodsService from '../services/goods'
import moment from 'moment';
const condition = {
  sorts: {
    created_at: 'desc'
  },
  page:1,
  per_page:10,
  date_type:'custom',
  sday:moment(new Date((new Date).getTime() - 7*24*60*60*1000),'YYYY-MM-DD').format('YYYY-MM-DD'),
  eday:moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD')
}
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
      const [data1,data2] = yield all([call(goodsService.getListSales,condition),call(goodsService.getListPurchase,condition)])
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
      const data = yield call(goodsService.changeGoodsStatus,payload)
      yield put({type:'getGoodsList'})
    },

    *deleteSingleGoods({payload},{call,put}) {
      const data = yield call(goodsService.deleteSingleGoods,payload)
      yield put({type:'getGoodsList'})
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
            let name = key.slice(5,key.length)
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
            let name = key.slice(9,key.length)
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
