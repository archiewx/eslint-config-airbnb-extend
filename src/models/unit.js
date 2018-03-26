import * as unitService from '../services/unit';

export default {

  namespace: 'unit',

  state: {
    units: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const data = yield call(unitService.getList);
      yield put({ type: 'setState',
        payload: {
          units: data.result.data,
        } });
    },
    *createSingle({ payload }, { call, put }) {
      const data = yield call(unitService.createSingle, payload);
      return data;
    },

    *editSingle({ payload }, { call, put }) {
      const data = yield call(unitService.editSingle, payload);
      return data;
    },

    *deleteSingle({ payload }, { call, put }) {
      const data = yield call(unitService.deleteSingle, payload);
      return data;
    },

    *editSort({ payload }, { call, put }) {
      yield call(unitService.editSort, payload);
    },
  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setSortMove(state, { payload: { currentId, moveWay } }) {
      moveWay == 'up' ? null : state.units.reverse();
      state.units.forEach((n, i) => {
        if (n.id == currentId) {
          i == 0 ? '' : (
            state.units.splice(i, 1),
            state.units.splice(i - 1, 0, n)
          );
        }
      });
      moveWay == 'up' ? null : state.units.reverse();
      state.units.forEach((item, index) => {
        item.sort = index;
      });
      return { ...state };
    },

  },

};
