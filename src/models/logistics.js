import * as logisticsService from '../services/logistics';

export default {

  namespace: 'logistics',

  state: {
    logistics: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getList({ payload }, { call, put, take }) {
      const data = yield call(logisticsService.getList);
      yield put({ type: 'setState',
        payload: {
          logistics: data.result.data,
        } });
    },

    *createSingle({ payload }, { call, put }) {
      const data = yield call(logisticsService.createSingle, payload);
      return data;
    },

    *editSingle({ payload }, { call, put }) {
      const data = yield call(logisticsService.editSingle, payload);
      return data;
    },

    *deleteSingle({ payload }, { call, put }) {
      yield call(logisticsService.deleteSingle, payload);
    },

    *editSort({ payload }, { call, put }) {
      yield call(logisticsService.editSort, payload);
    },
  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setSortMove(state, { payload: { currentId, moveWay } }) {
      moveWay == 'up' ? null : state.logistics.reverse();
      state.logistics.forEach((n, i) => {
        if (n.id == currentId) {
          i == 0 ? '' : (
            state.logistics.splice(i, 1),
            state.logistics.splice(i - 1, 0, n)
          );
        }
      });
      moveWay == 'up' ? null : state.logistics.reverse();
      state.logistics.forEach((item, index) => {
        item.sort = index;
      });
      return { ...state };
    },

  },

};
