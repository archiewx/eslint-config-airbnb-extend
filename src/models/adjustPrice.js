import * as adjustPriceService from '../services/adjustPrice'
export default  {

  namespace: 'adjustPrice',

  state: {
    adjustPrices:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getList ({payload},{call,put,take}) {
      const data = yield call(adjustPriceService.getList)
      yield put({type:'setAdjustPrice',payload:data.result.data})
    },

    *createSingle ({payload},{call,put}) {
      const data = yield call(adjustPriceService.createSingle,payload)
      return data
    },

    *editSingle ({payload},{call,put}) {
      const data = yield call(adjustPriceService.editSingle,payload)
      return data
    },

    *deleteSingle ({payload},{call,put}) {
      yield call(adjustPriceService.deleteSingle,payload)
    },

    *editSort ({payload},{call,put}) {
      yield call(adjustPriceService.editSort,payload)
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setAdjustPrice (state,{payload}) {
      state.adjustPrices = [];
      payload.forEach( n => {
        if(n.id != 1) {
          state.adjustPrices.push(n)
        }
      })
      return {...state}
    },

    setSortMove(state,{payload:{currentId,moveWay}}) {
      moveWay == 'up' ? null : state.adjustPrices.reverse();
      state.adjustPrices.forEach( (n,i) => {
        if(n.id == currentId) {
          i == 0 ? '' : (
            state.adjustPrices.splice(i,1),
            state.adjustPrices.splice(i-1,0,n)
          )
        }
      })
      moveWay == 'up' ? null : state.adjustPrices.reverse();
      state.adjustPrices.forEach((item,index)=>{
        item.sort = index;
      })
      return {...state}
    }
    
  },

};
