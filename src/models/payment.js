import * as paymentService from '../services/payment'
export default  {

  namespace: 'payment',

  state: {
    payments:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getList ({payload},{call,put,take}) {
      const data = yield call(paymentService.getList)
      yield put({type:'setState',payload:{
        payments:data.result.data
      }})
    },

    *createSingle ({payload},{call,put}) {
      yield call(paymentService.createSingle,payload)
    },

    *editSingle ({payload},{call,put}) {
      yield call(paymentService.editSingle,payload)
    },

    *deleteSingle ({payload},{call,put}) {
      yield call(paymentService.deleteSingle,payload)
    },
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

  },

};
