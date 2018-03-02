import * as saleOrderService from '../services/saleOrder'
export default  {

  namespace: 'saleOrderList',

  state: {
    saleOrderList:[],
    saleOrderPagination:{},
    fifterSaleOrderServerData:{},
  },

  subscriptions: {
    setup({ dispatch, history }) {
     
    },
  },

  effects: {
    *getList({payload},{call,put}) {
      const data = yield call(saleOrderService.getList,payload)
      yield put({type:'setState',payload:{
        saleOrderList: data.result.data,
        saleOrderPagination: data.result.meta.pagination
      }})
    },

    *deleteSingle({payload},{call,put}) {
      const data = yield call(saleOrderService.deleteSingle,payload)
    },

    // *changeCustomerStatus({payload},{call,put}) {
    //   const data = yield call(saleOrderService.changeCustomerStatus,payload)
    // }
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
      state.fifterSaleOrderServerData = current
      return {...state}
    }
  },

};
