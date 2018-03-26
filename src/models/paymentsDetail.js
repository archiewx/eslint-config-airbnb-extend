import * as paymentsService from '../services/payments';
import pathToRegexp from 'path-to-regexp';

export default {

  namespace: 'paymentsDetail',

  state: {
    singleData: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/finance/payments-detail/:id').exec(pathname);
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
      const data = yield call(paymentsService.getSingle, payload);
      yield put({ type: 'setShowData', payload: data.result.data });
    },

    *deleteSingle({ payload }, { call, put }) {
      yield call(paymentsService.deleteSingle, payload);
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
      // 金额
      state.singleData.value = payload.value;
      // 交易对象
      state.singleData.customer = payload.payer.data.name;
      // 入账店铺
      state.singleData.shop = payload.shop.data.name;
      // 收银员工
      state.singleData.user = payload.user.data.name;
      // 关联单据
      state.singleData.orderNumber = payload.docs && payload.docs.data.length ? payload.docs.data.map((n) => {
        let orderType;
        if ((n.number).indexOf('J') > -1) {
          orderType = '结算单';
        } else if ((n.number).indexOf('S') > -1) {
          orderType = '销售单';
        } else if ((n.number).indexOf('P') > -1) {
          orderType = '进货单';
        }
        return {
          number: n.number,
          id: n.id,
          orderType,
        };
      }) : '';
      // 支付方式
      state.singleData.paymentWays = payload.paymentmethod.data;
      // 操作记录
      state.singleData.operationSource = payload.docactionables.data;

      return { ...state };
    },
  },

};
