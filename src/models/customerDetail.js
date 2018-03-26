import * as customerService from '../services/customer';
import pathToRegexp from 'path-to-regexp';
import moment from 'moment';

export default {

  namespace: 'customerDetail',

  state: {
    singleCustomerDetail: {},
    singleCustomerFinance: {},
    singleCustomerSaleHistory: [],
    singleCustomerGoodsHistory: [],
    singleCustomerPaymentHistory: [],
    singleCustomerSalesorders: [],
    singleCustomerStatements: [],
    singleCustomerPayments: [],
    saleHistoryFilter: [],
    goodsHistoryFilter: [],
    paymentHistoryFilter: [],
    filterSaleServerData: {},
    filterGoodsServerData: {},
    filterPaymentServerData: {},
    currentId: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/relationship/customer-detail/:id').exec(location.hash.slice(1, location.hash.length));
        dispatch({ type: 'setState', payload: { singleCustomerDetail: {} } });
        if (match) {
          dispatch({ type: 'getSingle', payload: { id: match[1] } });
        }
      });
    },
  },

  effects: {
    *getSingle({ payload }, { call, put, all }) {
      const condition = {
        sorts: {
          created_at: 'desc',
        },
        date_type: 'custom',
        sday: moment(new Date((new Date()).getTime() - 7 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD').format('YYYY-MM-DD'),
        eday: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
        id: payload.id,
      };
      const conditionWTwo = {
        sorts: {
          purchase_time: 'desc',
        },
        date_type: 'custom',
        sday: moment(new Date((new Date()).getTime() - 7 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD').format('YYYY-MM-DD'),
        eday: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
        id: payload.id,
      };
      const conditionWThree = {
        sorts: {
          created_at: 'desc',
        },
        id: payload.id,
      };
      const [data1, data2, data3, data4, data5, data6, data7, data8] = yield all([
        call(customerService.getSingle, payload),
        call(customerService.getCustomerSaleHistory, condition),
        call(customerService.getCustomerGoodsHistory, conditionWTwo),
        call(customerService.getCustomerPaymentHistory, condition),
        call(customerService.getSalesordersNeedPay, conditionWThree),
        call(customerService.getStatementsNeedPay, conditionWThree),
        call(customerService.getCustomerfinance, payload),
        call(customerService.getCustomerPayments, conditionWThree),
      ]);

      yield put({ type: 'setShowData', payload: data1.result.data });
      yield put({ type: 'setState',
        payload: {
          singleCustomerSaleHistory: data2.result.data,
          singleCustomerGoodsHistory: data3.result.data,
          singleCustomerPaymentHistory: data4.result.data,
          saleHistoryFilter: data2.result.meta.filter.groups,
          goodsHistoryFilter: data3.result.meta.filter.groups,
          paymentHistoryFilter: data4.result.meta.filter.groups,
          singleCustomerSalesorders: data5.result.data,
          singleCustomerStatements: data6.result.data,
          currentId: payload,
          singleCustomerFinance: data7.result.data,
          singleCustomerPayments: data8.result.data,
        } });
    },

    *getSingleDetail({ payload }, { call, put }) {
      const data = yield call(customerService.getSingle, payload);
      yield put({ type: 'setShowData', payload: data.result.data });
    },

    *getSaleHistory({ payload }, { call, put }) {
      const data = yield call(customerService.getCustomerSaleHistory, payload);
      yield put({ type: 'setState',
        payload: {
          singleCustomerSaleHistory: data.result.data,
        } });
    },

    *getGoodsHistory({ payload }, { call, put }) {
      const data = yield call(customerService.getCustomerGoodsHistory, payload);
      yield put({ type: 'setState',
        payload: {
          singleCustomerGoodsHistory: data.result.data,
        } });
    },

    *getPaymentHistory({ payload }, { call, put }) {
      const data = yield call(customerService.getCustomerPaymentHistory, payload);
      yield put({ type: 'setState',
        payload: {
          singleCustomerPaymentHistory: data.result.data,
        } });
    },

    *getSalesorder({ payload }, { call, put }) {
      const data = yield call(customerService.getSalesordersNeedPay, payload);
      yield put({ type: 'setState',
        payload: {
          singleCustomerSalesorders: data.result.data,
        } });
    },

    *getStatement({ payload }, { call, put }) {
      const data = yield call(customerService.getStatementsNeedPay, payload);
      yield put({ type: 'setState',
        payload: {
          singleCustomerStatements: data.result.data,
        } });
    },

    *getPayments({ payload }, { call, put }) {
      const data = yield call(customerService.getCustomerPayments, payload);
      yield put({ type: 'setState',
        payload: {
          singleCustomerPayments: data.result.data,
        } });
    },

    *deleteSingle({ payload }, { call, put }) {
      const data = yield call(customerService.deleteSingle, payload);
    },

    *changeCustomerStatus({ payload }, { call, put, select }) {
      const data = yield call(customerService.changeCustomerStatus, payload);
      const { currentId } = yield select(({ customerDetail }) => customerDetail);
      yield put({ type: 'getSingleDetail', payload: currentId });
    },

  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setShowData(state, { payload }) {
      state.singleCustomerDetail.name = payload.name;
      state.singleCustomerDetail.phone = payload.phone;
      state.singleCustomerDetail.vip = payload.vip && payload.vip.data.name;
      state.singleCustomerDetail.debt = payload.debt;
      state.singleCustomerDetail.total_points = payload.total_points;
      state.singleCustomerDetail.basicDetail = [];

      payload.wechat ? state.singleCustomerDetail.basicDetail.push({
        parentName: '微信号',
        name: payload.wechat,
      }) : '';
      payload.seller ? state.singleCustomerDetail.basicDetail.push({
        parentName: '专属导购',
        name: payload.seller.data.name,
      }) : '';
      payload.remark1 ? state.singleCustomerDetail.basicDetail.push({
        parentName: '备注',
        name: payload.remark1,
      }) : '';

      payload.customergroups.data.forEach((item) => {
        state.singleCustomerDetail.basicDetail.push({
          parentName: item.parent.data[0].name,
          name: item.name,
        });
      });

      state.singleCustomerDetail.imageFiles = payload.attachments_url.map((item) => {
        return {
          url: item,
        };
      });
      state.singleCustomerDetail.freeze = payload.freeze;
      state.singleCustomerDetail.addresses = payload.addresses.data;
      return { ...state };
    },


    setFilterSaleServerData(state, { payload }) {
      const current = {};
      for (const key in payload) {
        if (key.indexOf('sale_') == 0) {
          if (payload[key]) {
            const name = key.slice(5, key.length);
            if (name == 'datePick') {
              current.date_type = 'custom';
              current.sday = payload[key][0];
              current.eday = payload[key][1];
            } else {
              current[`${name}_in`] = payload[key];
            }
          }
        }
      }
      for (const key in current) {
        if (Array.isArray(current[key]) && !current[key].length) {
          delete current[key];
        }
      }
      state.filterSaleServerData = current;
      return { ...state };
    },

    setFilterGoodsServerData(state, { payload }) {
      const current = {};
      for (const key in payload) {
        if (key.indexOf('goods_') == 0) {
          if (payload[key]) {
            const name = key.slice(6, key.length);
            if (name == 'datePick') {
              current.date_type = 'custom';
              current.sday = payload[key][0];
              current.eday = payload[key][1];
            } else {
              current[`${name}_in`] = payload[key];
            }
          }
        }
      }
      for (const key in current) {
        if (Array.isArray(current[key]) && !current[key].length) {
          delete current[key];
        }
      }
      state.filterGoodsServerData = current;
      return { ...state };
    },

    setFilterPurchaseServerData(state, { payload }) {
      const current = {};
      for (const key in payload) {
        if (key.indexOf('payment_') == 0) {
          if (payload[key]) {
            const name = key.slice(8, key.length);
            if (name == 'datePick') {
              current.date_type = 'custom';
              current.sday = payload[key][0];
              current.eday = payload[key][1];
            } else {
              current[`${name}_in`] = payload[key];
            }
          }
        }
      }
      for (const key in current) {
        if (Array.isArray(current[key]) && !current[key].length) {
          delete current[key];
        }
      }
      state.filterPaymentServerData = current;
      return { ...state };
    },
  },

};
