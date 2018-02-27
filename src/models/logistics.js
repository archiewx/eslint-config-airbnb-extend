import * as logisticsService from '../services/logistics'
export default  {

  namespace: 'logistics',

  state: {
    logistics:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getList ({payload},{call,put,take}) {
      const data = yield call(logisticsService.getList)
      yield put({type:'setState',payload:{
        logistics:data.result.data
      }})
    },

    *createSingle ({payload},{call,put}) {
      yield call(logisticsService.createSingle,payload)
    },

    *editSingle ({payload},{call,put}) {
      yield call(logisticsService.editSingle,payload)
    },

    *deleteSingle ({payload},{call,put}) {
      yield call(logisticsService.deleteSingle,payload)
    },
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

  },

};
