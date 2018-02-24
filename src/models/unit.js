import * as unitService from '../services/unit'
export default  {

  namespace: 'unit',

  state: {
    units:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getList ({payload},{call,put}) {
      const data = yield call(unitService.getList) 
      yield put({type:'setState',payload:{
        units:data.result.data
      }})
    },
    *createSingle ({payload},{call,put}) {
      yield call(unitService.createSingle,payload)
    },

    *editSingle ({payload},{call,put}) {
      yield call(unitService.editSingle,payload)
    },

    *deleteSingle ({payload},{call,put}) {
      yield call(unitService.deleteSingle,payload)
    },
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

  },

};
