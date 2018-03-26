import * as sellerService from '../services/seller';
import { message } from 'antd';

export default {

  namespace: 'seller',

  state: {
    sellers: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const data = yield call(sellerService.getList);
      yield put({ type: 'setState',
        payload: {
          sellers: data.result.data,
        } });
    },
  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
