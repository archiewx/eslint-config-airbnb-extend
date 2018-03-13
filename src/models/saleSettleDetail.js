import * as settleService from '../services/settle'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'saleSettleDetail',

  state: {
    singleData:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({pathname}) => {
        const match = pathToRegexp('/finance/sale-settle-detail/:id').exec(pathname)
        if(match) {
          dispatch({type:'setState',payload:{
            singleData:{}
          }})
          dispatch({type:'getSingle',payload:{
            id:match[1]
          }})
        }
      })
    },
  },

  effects: {
    *getSingle ({payload},{call,put,take}) {
      const data = yield call(settleService.getSingle,payload)
      console.log(data.result.data)
      yield put({type:'setShowData',payload:data.result.data})
    },

  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setShowData(state,{payload}) {
      state.singleData.id = payload.id;
      state.singleData.number = payload.number;
      state.singleData.customer = payload.payer.data.name;
      state.singleData.operationSource = payload.docactionables.data;
      state.singleData.paymentWays = payload.paymentmethod.data;
      
      return {...state}
    }
  },

};
