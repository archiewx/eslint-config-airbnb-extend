import * as purchaseOrderService from '../services/purchaseOrder';

export default {
  namespace: 'purchaseOrderList',

  state: {
    purchaseOrderList: [],
    purchaseOrderPagination: {},
    fifterPurchaseOrderServerData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const data = yield call(purchaseOrderService.getList, payload);
      yield put({
        type: 'setState',
        payload: {
          purchaseOrderList: data.result.data,
          purchaseOrderPagination: data.result.meta.pagination,
        },
      });
    },

    *deleteSingle({ payload }, { call, put }) {
      yield call(purchaseOrderService.deleteSingle, payload);
    },
  },

  reducers: {
    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setFilterSaleOrderServerData(state, { payload }) {
      const current = {};
      const params = { ...payload };
      // 获取key值处理
      Object.keys(params).forEach((key) => {
        if (key === 'dates') {
          current.date_type = 'custom';
          // 这里得到是一个moment 对象
          [current.sday, current.eday] = params[key];
          current.sday = current.sday.format('YYYY-MM-DD');
          current.eday = current.eday.format('YYYY-MM-DD');
          delete current.dates;
        } else {
          current[`${key}_in`] = params[key];
        }
      });
      state.fifterPurchaseOrderServerData = current;
      return { ...state };
    },
  },
};
