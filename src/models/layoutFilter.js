import * as layoutFilterServices from '../services/layoutFilter';

export default {

  namespace: 'layoutFilter',

  state: {
    goodsSaleFilter: [],
    goodsPurchaseFilter: [],
    goodsDetailFilter: [],
    customerFilter: [],
    supplierFilter: [],
    saleOrderFilter: [],
    purchaseOrderFilter: [],
    inventoryOrderFilter: [],
    deliverOrderFilter: [],
    paymentsFilter: [],
    saleSettleFilter: [],
    purchaseSettleFilter: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // dispatch({type:'getLayoutFilter'})
    },
  },

  effects: {
    *getLayoutFilter({ payload }, { call, put }) {
      const data = yield call(layoutFilterServices.getLayoutFilter);
      yield put({ type: 'setState',
        payload: {
          goodsSaleFilter: data.result.item_sales_list.filter.groups,
          goodsPurchaseFilter: data.result.item_purchase_list.filter.groups,
          goodsDetailFilter: data.result.item_detail.filter.groups,
          customerFilter: data.result.customer_list.filter.groups,
          supplierFilter: data.result.supplier_list.filter.groups,
          saleOrderFilter: data.result.salesorder_list.filter.groups,
          purchaseOrderFilter: data.result.purchaseorder_list.filter.groups,
          inventoryOrderFilter: data.result.inventorydoc_list.filter.groups,
          deliverOrderFilter: data.result.transferdoc_list.filter.groups,
          paymentsFilter: data.result.payment_list.filter.groups,
          saleSettleFilter: data.result.statement_list.filter.groups,
          purchaseSettleFilter: data.result.statement_list.filter.groups,
        } });
    },
  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
