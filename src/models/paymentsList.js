import * as paymentsService from '../services/payments'
export default  {

  namespace: 'paymentsList',

  state: {
    paymentsList:[],
    paymentsPagination:{},
    fifterPaymentsServerData:{},
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getList ({payload},{call,put,take}) {
      const data = yield call(paymentsService.getList,payload)
      yield put({type:'setState',payload:{
        paymentsList:data.result.data,
        paymentsPagination:data.result.meta.pagination,
      }})
    },

  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setFilterPaymentsServerData (state,{payload}) {
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
      state.fifterPaymentsServerData = current
      return {...state}
    }

  },

};
