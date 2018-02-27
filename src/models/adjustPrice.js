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
      yield put({type:'setState',payload:{
        adjustPrices:data.result.data
      }})
    },

    *createSingle ({payload},{call,put}) {
      yield call(adjustPriceService.createSingle,payload)
    },

    *editSingle ({payload},{call,put}) {
      yield call(adjustPriceService.editSingle,payload)
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
