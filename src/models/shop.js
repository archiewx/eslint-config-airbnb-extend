import * as shopService from '../services/shop';

export default {

  namespace: 'shop',

  state: {
    shops: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {

    },
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const data = yield call(shopService.getList);
      yield put({ type: 'setShops', payload: data.result.data });
    },

    *editWarehouse({ payload }, { call, put }) {
      yield call(shopService.editWarehouse, payload);
    },

    *editItem({ payload }, { call, put }) {
      yield call(shopService.editItem, payload);
    },

    *editBind({ payload }, { call, put, all }) {
      yield all([call(shopService.editWarehouse, payload.warehouseData), call(shopService.editItem, payload.itemData)]);
    },
  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setShops(state, { payload }) {
      payload.forEach((n, i) => {
        state.shops[i] = {
          id: n.id,
          name: n.name,
          warehouses: n.warehouses,
          itemgroups: [],
        };
        n.itemgroups.data.forEach((m, e) => {
          if (!m.parent_id) {
            state.shops[i].itemgroups.push({
              id: m.id,
              name: m.name,
              sort: m.sort,
              children: [],
            });
          }
        });
        state.shops[i].itemgroups.sort((a, b) => {
          return a.sort - b.sort;
        });
        n.itemgroups.data.forEach((m, e) => {
          if (m.parent_id) {
            const current = state.shops[i].itemgroups.find(q => q.id == m.parent_id);
            if (current) {
              current.children.push(m);
            }
          }
        });
      });
      return { ...state };
    },

  },

};
