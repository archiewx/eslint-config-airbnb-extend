import * as priceGradeService from '../services/priceGrade';

export default {

  namespace: 'priceGrade',

  state: {
    priceGrades: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const data = yield call(priceGradeService.getList);
      yield put({ type: 'setState',
        payload: {
          priceGrades: data.result.data,
        } });
    },

    *createSingle({ payload }, { call, put }) {
      const data = yield call(priceGradeService.createSingle, payload);
      return data;
    },

    *editSingle({ payload }, { call, put }) {
      const data = yield call(priceGradeService.editSingle, payload);
      return data;
    },

    *deleteSingle({ payload }, { call, put }) {
      const data = yield call(priceGradeService.deleteSingle, payload);
      return data;
    },

    *editSort({ payload }, { call, put }) {
      yield call(priceGradeService.editSort, payload);
    },
  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setSortMove(state, { payload: { currentId, moveWay } }) {
      moveWay == 'up' ? null : state.priceGrades.reverse();
      state.priceGrades.forEach((n, i) => {
        if (n.id == currentId) {
          i == 0 ? '' : (
            state.priceGrades.splice(i, 1),
            state.priceGrades.splice(i - 1, 0, n)
          );
        }
      });
      moveWay == 'up' ? null : state.priceGrades.reverse();
      state.priceGrades.forEach((item, index) => {
        item.sort = index;
      });
      console.log(state.priceGrades);
      return { ...state };
    },
  },

};
