import * as inventoryOrderService from '../services/inventoryOrder'
export default  {

  namespace: 'inventoryOrderList',

  state: {
    inventoryOrderList:[],
    inventoryOrderPagination:{},
    fifterInventoryOrderServerData:{},
  },

  subscriptions: {
    setup({ dispatch, history }) {
     
    },
  },

  effects: {
    *getList({payload},{call,put}) {
      const data = yield call(inventoryOrderService.getList,payload)
      yield put({type:'setState',payload:{
        inventoryOrderList: data.result.data,
        inventoryOrderPagination: data.result.meta.pagination
      }})
    },

    *deleteSingle({payload},{call,put}) {
      const data = yield call(inventoryOrderService.deleteSingle,payload)
    },

    // *changeCustomerStatus({payload},{call,put}) {
    //   const data = yield call(inventoryOrderService.changeCustomerStatus,payload)
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
      state.fifterInventoryOrderServerData = current
      return {...state}
    }
  },

};
