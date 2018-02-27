import * as labelService from '../services/label'
export default  {

  namespace: 'label',

  state: {
    itemLabels:[],
    saleLabels:[],
    purchaseLabels:[]
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getItemLabel ({payload},{call,put,take}) {
      const data = yield call(labelService.getItemLabel)
      yield put({type:'setState',payload:{
        itemLabels:data.result.data
      }})
    },

    *editItemLableSingle ({payload},{call,put}) {
      yield call(labelService.editItemLableSingle,payload)
    },

    *getSaleOrderLabel({payload},{call,put}) {
      const data = yield call(labelService.getSaleOrderLabel)
      yield put({type:'setState',payload:{
        saleLabels:data.result.data
      }})
    },

    *editSaleOrderLabel({payload},{call,put}) {
      const data = yield call(labelService.editSaleOrderLabel,payload)
    },

    *getPurchaseOrderLabel({payload},{call,put}) {
      const data = yield call(labelService.getPurchaseOrderLabel)
      yield put({type:'setState',payload:{
        purchaseLabels:data.result.data
      }})
    },

    *editPurchaseOrderLabel({payload},{call,put}) {
      const data = yield call(labelService.editPurchaseOrderLabel,payload)
    },

  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

  },

};
