import * as purchaseOrderService from '../services/purchaseOrder'
export default  {

  namespace: 'purchaseOrderList',

  state: {
    purchaseOrderList:[],
    purchaseOrderPagination:{},
    fifterPurchaseOrderServerData:{},
  },

  subscriptions: {
    setup({ dispatch, history }) {
     
    },
  },

  effects: {
    *getList({payload},{call,put}) {
      const data = yield call(purchaseOrderService.getList,payload)
      yield put({type:'setState',payload:{
        purchaseOrderList: data.result.data,
        purchaseOrderPagination: data.result.meta.pagination
      }})
    },

    *deleteSingle({payload},{call,put}) {
      yield call(purchaseOrderService.deleteSingle,payload)
    },

  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setFilterSaleOrderServerData (state,{payload}) {
      let current = {}
      for(let key in payload) {
        if(payload[key]) {
          if(key == 'datePick') {
            current['date_type'] = 'custom'
            current['sday'] = payload[key][0]
            current['eday'] = payload[key][1]
          }else {
            current[`${key}_in`] = payload[key]
          }
        }
      }
      for(let key in current) {
        if(Array.isArray(current[key]) && !current[key].length) {
          delete current[key]
        }
      }
      state.fifterPurchaseOrderServerData = current
      return {...state}
    }
  },

};
