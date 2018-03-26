import * as customerService from '../services/customer';

export default {

  namespace: 'customerList',

  state: {
    customerList: [],
    customerPagination: {},
    fifterCustomerServerData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const data = yield call(customerService.getList, payload);
      yield put({ type: 'setState',
        payload: {
          customerList: data.result.data,
          customerPagination: data.result.meta.pagination,
        } });
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
      for (const key in payload) {
        if (payload[key]) {
          if (key == 'datePick') {
            current.date_type = 'custom';
            current.sday = payload[key][0];
            current.eday = payload[key][1];
          } else {
            current[`${key}_in`] = payload[key];
          }
        }
      }
      for (const key in current) {
        if (Array.isArray(current[key]) && !current[key].length) {
          delete current[key];
        }
      }
      state.fifterCustomerServerData = current;
      return { ...state };
    },
  },

};
