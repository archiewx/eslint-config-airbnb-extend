import * as layoutServices from '../services/layout'

export default  {

  namespace: 'layout',

  state: {
    goodsSaleFilter:[],
    goodsPurchaseFilter:[],
    goodsDetailFilter:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({type:'getLayout'})
    },
  },

  effects: {
    *getLayout({payload},{call,put}) {
      const data = yield call(layoutServices.getLayout)
      yield put({type:'setState',payload:{
        goodsSaleFilter: data.result.item_sales_list.filter.groups,
        goodsPurchaseFilter:data.result.item_purchase_list.filter.groups,
        goodsDetailFilter:data.result.item_detail.filter.groups,
      }})
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

  },

};
