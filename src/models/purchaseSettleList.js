import * as settleService from '../services/settle'
export default  {

  namespace: 'purchaseSettleList',

  state: {
    purchaseSettleList:[],
    purchaseSettlePagination:{},
    fifterPurchaseSettleServerData:{},
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getList ({payload},{call,put,take}) {
      const data = yield call(settleService.getList,payload)
      yield put({type:'setState',payload:{
        purchaseSettleList:data.result.data,
        purchaseSettlePagination:data.result.meta.pagination,
      }})
    },

    *deleteSingle({payload},{call,put}) {
      yield call(settleService.deleteSingle,payload)
    }

  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setFilterPurchaseSettleServerData (state,{payload}) {
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
      state.fifterPurchaseSettleServerData = current
      return {...state}
    }

  },

};
