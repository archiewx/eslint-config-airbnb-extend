import * as goodsService from '../services/goods';

export default {
  namespace: 'goodsList',

  state: {
    goodsListSales: [],
    goodsListPurchases: [],
    goodsSalePagination: {},
    goodsPurchasePagination: {},
    filterSaleServerData: {},
    filterPurchaseServerData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {},
  },

  effects: {
    *getGoodsList({ payload }, { call, put, all }) {
      const [data1, data2] = yield all([
        call(goodsService.getListSales, payload),
        call(goodsService.getListPurchase, payload),
      ]);
      yield put({
        type: 'setState',
        payload: {
          goodsListSales: data1.result.data,
          goodsListPurchases: data2.result.data,
          goodsSalePagination: data1.result.meta.pagination,
          goodsPurchasePagination: data2.result.meta.pagination,
        },
      });
    },

    *getGoodsSaleList({ payload }, { call, put }) {
      const data = yield call(goodsService.getListSales, payload);
      yield put({
        type: 'setState',
        payload: {
          goodsListSales: data.result.data,
          goodsSalePagination: data.result.meta.pagination,
        },
      });
    },

    *getGoodsPurchaseList({ payload }, { call, put }) {
      const data = yield call(goodsService.getListPurchase, payload);
      yield put({
        type: 'setState',
        payload: {
          goodsListPurchases: data.result.data,
          goodsPurchasePagination: data.result.meta.pagination,
        },
      });
    },

    *changeGoodsStatus({ payload }, { call, put }) {
      yield call(goodsService.changeGoodsStatus, payload);
    },

    *deleteSingleGoods({ payload }, { call, put }) {
      yield call(goodsService.deleteSingleGoods, payload);
    },
  },

  reducers: {
    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setFilterSaleServerData(state, { payload }) {
      const current = {};
      const params = { ...payload };
      // 获取key值处理
      Object.keys(params).forEach((key) => {
        if (key === 'dates') {
          current.date_type = 'custom';
          // 这里得到是一个moment 对象
          [current.sday, current.eday] = params[key];
          current.sday = current.sday.format('YYYY-MM-DD');
          current.eday = current.eday.format('YYYY-MM-DD');
          delete current.dates;
        } else {
          current[`${key}_in`] = params[key];
        }
      });
      // todo: 按照redux 中不能修改state
      state.filterSaleServerData = current;
      return { ...state };
    },

    setFilterPurchaseServerData(state, { payload }) {
      const current = {};
      const params = { ...payload };
      // 获取key值处理
      Object.keys(params).forEach((key) => {
        if (key === 'dates') {
          current.date_type = 'custom';
          // 这里得到是一个moment 对象
          [current.sday, current.eday] = params[key];
          current.sday = current.sday.format('YYYY-MM-DD');
          current.eday = current.eday.format('YYYY-MM-DD');
          delete current.dates;
        } else {
          current[`${key}_in`] = params[key];
        }
      });
      state.filterPurchaseServerData = current;
      return { ...state };
    },
  },
};
