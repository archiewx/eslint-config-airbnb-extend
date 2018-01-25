import * as layoutFilterServices from '../services/layoutFilter'

export default  {

  namespace: 'layoutFilter',

  state: {
    goodsSaleFilter:[],
    goodsPurchaseFilter:[],
    goodsDetailFilter:[],
    customerFilter:[],
    supplierFilter:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({type:'getLayoutFilter'})
    },
  },

  effects: {
    *getLayoutFilter({payload},{call,put}) {
      const data = yield call(layoutFilterServices.getLayoutFilter)
      yield put({type:'setState',payload:{
        goodsSaleFilter: data.result.item_sales_list.filter.groups,
        goodsPurchaseFilter:data.result.item_purchase_list.filter.groups,
        goodsDetailFilter: data.result.item_detail.filter.groups,
        customerFilter: data.result.customer_list.filter.groups,
        supplierFilter: data.result.supplier_list.filter.groups
      }})
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },
  },

};
