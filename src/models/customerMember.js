import * as customerMemberService from '../services/customerMember';

export default {

  namespace: 'customerMember',

  state: {
    customerMembers: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getList({ payload }, { call, put, take }) {
      const data = yield call(customerMemberService.getList);
      yield put({ type: 'setState',
        payload: {
          customerMembers: data.result.data,
        } });
    },

    *createSingle({ payload }, { call, put }) {
      const data = yield call(customerMemberService.createSingle, payload);
      return data;
    },

    *editSingle({ payload }, { call, put }) {
      const data = yield call(customerMemberService.editSingle, payload);
      return data;
    },

    *deleteSingle({ payload }, { call, put }) {
      yield call(customerMemberService.deleteSingle, payload);
    },

    *editSort({ payload }, { call, put }) {
      yield call(customerMemberService.editSort, payload);
    },
  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setSortMove(state, { payload: { currentId, moveWay } }) {
      moveWay == 'up' ? null : state.customerMembers.reverse();
      state.customerMembers.forEach((n, i) => {
        if (n.id == currentId) {
          i == 0 ? '' : (
            state.customerMembers.splice(i, 1),
            state.customerMembers.splice(i - 1, 0, n)
          );
        }
      });
      moveWay == 'up' ? null : state.customerMembers.reverse();
      state.customerMembers.forEach((item, index) => {
        item.sort = index;
      });
      return { ...state };
    },

  },

};
