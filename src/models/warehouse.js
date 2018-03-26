import * as warehouseService from '../services/warehouse';

export default {

  namespace: 'warehouse',

  state: {
    warehouses: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const data = yield call(warehouseService.getList);
      yield put({ type: 'setState',
        payload: {
          warehouses: data.result.data,
        } });
    },
  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },

  },

};
