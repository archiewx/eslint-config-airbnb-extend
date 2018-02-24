import * as colorService from '../services/color'
export default  {

  namespace: 'color',

  state: {
    colors:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getList ({payload},{call,put,take}) {
      const data = yield call(colorService.getList)
      yield put({type:'setState',payload:{
        colors:data.result.data.skuattributes.data,
      }})
    },

    *createSingle ({payload},{call,put}) {
      yield call(colorService.createSingle,payload)
    },

    *editSingle ({payload},{call,put}) {
      yield call(colorService.editSingle,payload)
    },

    *deleteSingle ({payload},{call,put}) {
      yield call(colorService.deleteSingle,payload)
    },
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

  },

};
