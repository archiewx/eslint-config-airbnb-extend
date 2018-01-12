import * as goodsService from '../services/goods'

export default  {

  namespace: 'goodsList',

  state: {
    goodsListSales: [],
    goodsListPurchases: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({type:'getGoodsList'})
    },
  },

  effects: {
    *getGoodsList({payload},{call,put}) {
      const [data1,data2] = yield [call(goodsService.getListSales),call(goodsService.getListPurchase)]
      yield put({type:'setState',payload:{
        goodsListSales:data1.result.data,
        goodsListPurchases:data2.result.data
      }})
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

  },

};
