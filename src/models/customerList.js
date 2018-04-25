import * as customerService from '../services/customer';

export default {
  namespace: 'customerList',

  state: {
    customerList: [],
    customerPagination: {},
    fifterCustomerServerData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const data = yield call(customerService.getList, payload);
      yield put({
        type: 'setState',
        payload: {
          customerList: data.result.data,
          customerPagination: data.result.meta.pagination,
        },
      });
    },

    *deleteSingle({ payload }, { call, put }) {
      const data = yield call(customerService.deleteSingle, payload);
    },

    *changeCustomerStatus({ payload }, { call, put }) {
      const data = yield call(customerService.changeCustomerStatus, payload);
    },
  },

  reducers: {
    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setFilterCustomerServerData(state, { payload }) {
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
      state.fifterCustomerServerData = current;
      return { ...state };
    },
  },
};
