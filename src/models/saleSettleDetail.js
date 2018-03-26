import * as settleService from '../services/settle';
import * as printService from '../services/print';
import pathToRegexp from 'path-to-regexp';

export default {

  namespace: 'saleSettleDetail',

  state: {
    singleData: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/finance/sale-settle-detail/:id').exec(pathname);
        if (match) {
          dispatch({ type: 'setState', payload: { singleData: {} } });
          dispatch({ type: 'getSingle',
            payload: {
              id: match[1],
            } });
        }
      });
    },
  },

  effects: {
    *getSingle({ payload }, { call, put, take }) {
      const data = yield call(settleService.getSingle, payload);
      yield put({ type: 'setShowData', payload: data.result.data });
    },

    *printSettle({ payload }, { call, put }) {
      yield call(printService.printSettle, payload);
    },

    *deleteSingle({ payload }, { call, put }) {
      yield call(settleService.deleteSingle, payload);
    },

  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setShowData(state, { payload }) {
      state.singleData.id = payload.id;
      // 单号
      state.singleData.number = payload.number;
      // 交易客户
      state.singleData.customer = payload.ownerable.data.name;
      // 单据数量
      state.singleData.order_quantity = payload.order_quantity;
      // 商品数量
      state.singleData.item_quantity_one = payload.item_quantity_one;
      // 总额
      state.singleData.value = payload.value;
      // 支付状态
      state.singleData.pay_status = payload.pay_status;
      // 支付方式
      state.singleData.paymentWays = payload.payments.data.length == 0 ? ['未付款'] : payload.payments.data.map((n) => { return { name: n.paymentmethod.data.name, value: n.value }; });
      // 结算清单
      state.singleData.orders = payload.orders.data;
      // 操作记录
      state.singleData.operationSource = payload.docactionables.data;
      return { ...state };
    },
  },

};
