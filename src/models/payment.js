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
      const data = yield call(paymentService.createSingle,payload)
      return data;
    },

    *editSingle ({payload},{call,put}) {
      const data = yield call(paymentService.editSingle,payload)
      return data;
    },

    *deleteSingle ({payload},{call,put}) {
      yield call(paymentService.deleteSingle,payload)
    },

    *editSort ({payload},{call,put}) {
      yield call(paymentService.editSort,payload)
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setSortMove(state,{payload:{currentId,moveWay}}) {
      moveWay == 'up' ? null : state.payments.reverse();
      state.payments.forEach( (n,i) => {
        if(n.id == currentId) {
          i == 0 ? '' : (
            state.payments.splice(i,1),
            state.payments.splice(i-1,0,n)
          )
        }
      })
      moveWay == 'up' ? null : state.payments.reverse();
      state.payments.forEach((item,index)=>{
        item.sort = index;
      })
      return {...state}
    }

  },

};
