import * as supplierService from '../services/supplier';

export default {

  namespace: 'supplierList',

  state: {
    supplierList: [],
    supplierPagination: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const data = yield call(supplierService.getList, payload);
      yield put({ type: 'setState',
        payload: {
          supplierList: data.result.data,
          supplierPagination: data.result.meta.pagination,
        } });
    },

    *deleteSingle({ payload }, { call, put }) {
      yield call(supplierService.deleteSingle, payload);
    },

    *changeSupplierStatus({ payload }, { call, put }) {
      yield call(supplierService.changeSupplierStatus, payload);
    },
  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
