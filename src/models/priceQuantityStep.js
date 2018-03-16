import * as priceQuantityStepService from '../services/priceQuantityStep'
export default  {

  namespace: 'priceQuantityStep',

  state: {
    priceQuantitySteps:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      
    },
  },

  effects: {
    *getList({payload},{call,put}) {
      const data = yield call(priceQuantityStepService.getList) 
      yield put({type:'setpriceQuantityStepState',payload:data.result.data})
    },

    *createSingle({payload},{call,put}) {
      yield call(priceQuantityStepService.createSingle,payload)
    },

    *deleteSingle({payload},{call,put}) {
      yield call(priceQuantityStepService.deleteSingle,payload)
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setpriceQuantityStepState (state,{payload}) {
      state.priceQuantitySteps = payload.map((item)=>{
        return {
          id: `${item.id}`,
          name: item.quantityranges.data.map((item)=>{
                  return item.min + '~';
                }).join(''),
          quantityranges: item.quantityranges.data
        }
      })
      return {...state}
    },

  },

};
