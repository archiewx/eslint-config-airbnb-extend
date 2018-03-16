import * as settleService from '../services/settle'
import * as printService from '../services/print'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'purchaseSettleDetail',

  state: {
    singleData:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({pathname}) => {
        const match = pathToRegexp('/finance/purchase-settle-detail/:id').exec(pathname)
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
      yield put({type:'setShowData',payload:data.result.data})
    },

    *printSettle ({payload},{call,put}) {
      yield call(printService.printSettle ,payload)
    }

  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setShowData(state,{payload}) {
      state.singleData.id = payload.id;
      state.singleData.number = payload.number;
      state.singleData.supplier = payload.ownerable.data.name;
      state.singleData.order_quantity = payload.order_quantity;
      state.singleData.item_quantity_one = payload.item_quantity_one;
      state.singleData.value = payload.value;
      state.singleData.pay_status = payload.pay_status;
      state.singleData.orders = payload.orders.data;
      state.singleData.paymentWays = payload.payments.data.length == 0 ? ['未付款'] : payload.payments.data.map( n => {return {name:n.paymentmethod.data.name,value:n.value}})
      state.singleData.operationSource = payload.docactionables.data;
      return {...state}
    }
  },

};
