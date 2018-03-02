import * as customerService from '../services/customer'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'customerSkusPurchaseDetail',

  state: {
    skusPurchaseList:[],
    customerId:'',
    itemId:'',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/relationship/customer-detail/skus-purchase-detail/:id/:subId/:name').exec(location.hash.slice(1,location.hash.length))
        if(match) {
          dispatch({type:'setState',payload:{
            skusPurchaseList:[],
          }})
          dispatch({type:'getList',payload:{
            id:match[1],
            subId:match[2],
            sorts:{
              created_at:'desc'
            }
          }})
        }
      })
    },
  },

  effects: {
    *getList({payload},{call,put}) {
      const data = yield call(customerService.getSkusPurchaseDetail,payload)
      yield put({type:'setState',payload:{
        skusPurchaseList:data.result.data
      }})
      yield put({type:'setState',payload:{
        customerId:payload.id,
        itemId:payload.subId,
      }})
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

 
  },

};











