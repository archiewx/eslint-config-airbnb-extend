import * as cinventoryApproverService from '../services/inventoryApprover';

export default {

  namespace: 'inventoryApprover',

  state: {
    approvers: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({ type: 'getList' });
    },
  },

  effects: {
    *getList({ payload }, { call, put, take }) {
      const data = yield call(cinventoryApproverService.getList);
      yield put({ type: 'setState',
        payload: {
          approvers: data.result.data,
        } });
    },
  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },

  },

};
