import * as settleService from '../services/settle';

export default {
  namespace: 'purchaseSettleList',

  state: {
    purchaseSettleList: [],
    purchaseSettlePagination: {},
    fifterPurchaseSettleServerData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getList({ payload }, { call, put, take }) {
      const data = yield call(settleService.getList, payload);
      yield put({
        type: 'setState',
        payload: {
          purchaseSettleList: data.result.data,
          purchaseSettlePagination: data.result.meta.pagination,
        },
      });
    },

    *deleteSingle({ payload }, { call, put }) {
      yield call(settleService.deleteSingle, payload);
    },
  },

  reducers: {
    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setFilterPurchaseSettleServerData(state, { payload }) {
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
      state.fifterPurchaseSettleServerData = current;
      return { ...state };
    },
  },
};
