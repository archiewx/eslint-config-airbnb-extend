import * as deliverOrderService from '../services/deliverOrder';

export default {

  namespace: 'deliverOrderList',

  state: {
    deliverOrderList: [],
    deliverOrderPagination: {},
    fifterDeliverOrderServerData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const data = yield call(deliverOrderService.getList, payload);
      yield put({ type: 'setState',
        payload: {
          deliverOrderList: data.result.data,
          deliverOrderPagination: data.result.meta.pagination,
        } });
    },

    *deleteSingle({ payload }, { call, put }) {
      const data = yield call(deliverOrderService.deleteSingle, payload);
    },

    // *changeCustomerStatus({payload},{call,put}) {
    //   const data = yield call(deliverOrderService.changeCustomerStatus,payload)
    // }
  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setFilterSaleOrderServerData(state, { payload }) {
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
      state.fifterDeliverOrderServerData = current;
      return { ...state };
    },
  },

};
