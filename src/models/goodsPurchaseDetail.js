import * as customerService from '../services/customer'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'goodsPurchaseDetail',

  state: {
    goodsPurchaseList:[]
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/relationship/customer-detail/goods-purchase-detail/:id/:subId').exec(location.hash.slice(1,location.hash.length))
        if(match) {
          dispatch({type:'getList',payload:{
            id:match[1],
            subId:match[2]
          }})
        }
      })
    },
  },

  effects: {
    *getList({payload},{call,put}) {
      const data = yield call(customerService.getGoodsPurchaseDetail,payload)
      yield put({type:'setState',payload:data.result.skus})
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setGoodsPurchaseList (state,{payload}) {
      // payload.forEach( item => {
        
      // })
      return {...state}
    }
  },

};
