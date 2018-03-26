// import * as goodsService from '../services/goods'
import * as goodsGroupService from '../services/goodsGroup';
import * as colorService from '../services/color';
import * as sizeLibraryService from '../services/sizeLibrary';
import * as unitService from '../services/unit';
import * as priceGradeService from '../services/priceGrade';
import * as priceQuantityStepService from '../services/priceQuantityStep';
import * as shopService from '../services/shop';
import * as warehouseService from '../services/warehouse';

export default {

  namespace: 'commonData',

  state: {
    goodsGroups: [],
    colors: [],
    sizeLibrarys: [],
    units: [],
    priceGrades: [],
    priceQuantitySteps: [],
    shops: [],
    warehouses: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getGoodsGroup({ payload }, { call, put }) {
      const data = yield call(goodsGroupService.getListGroup);
      yield put({ type: 'setState',
        payload: {
          goodsGroups: data.result.data,
        } });
    },

    *getColor({ payload }, { call, put }) {
      const data = yield call(colorService.getList);
      yield put({ type: 'setState',
        payload: {
          colors: data.result.data.skuattributes.data,
        } });
    },

    *getSizeLibrary({ payload }, { call, put }) {
      const data = yield call(sizeLibraryService.getList);
      yield put({ type: 'setState',
        payload: {
          sizeLibrarys: data.result.data.skuattributes.data,
        } });
    },

    *getUnit({ payload }, { call, put }) {
      const data = yield call(unitService.getList);
      yield put({ type: 'setState',
        payload: {
          units: data.result.data,
        } });
    },

    *getPriceGrade({ payload }, { call, put }) {
      const data = yield call(priceGradeService.getList);
      yield put({ type: 'setState',
        payload: {
          priceGrades: data.result.data,
        } });
    },

    *getPriceQuantityStep({ payload }, { call, put }) {
      const data = yield call(priceQuantityStepService.getList);
      yield put({ type: 'setpriceQuantityStepState', payload: data.result.data });
    },


    *getShop({ payload }, { call, put }) {
      const data = yield call(shopService.getList);
      yield put({ type: 'setState',
        payload: {
          shops: data.result.data,
        } });
    },


    *getWarehouse({ payload }, { call, put }) {
      const data = yield call(warehouseService.getList);
      yield put({ type: 'setState',
        payload: {
          warehouses: data.result.data,
        } });
    },

    *getGoodsCreateOrEdit({ payload }, { call, put, all }) {
      const [data1, data2, data3, data4, data5, data6, data7, data8] = yield all([call(goodsGroupService.getListGroup), call(colorService.getList), call(sizeLibraryService.getList), call(unitService.getList), call(priceGradeService.getList), call(priceQuantityStepService.getList), call(shopService.getList), call(warehouseService.getList)]);
      yield put({ type: 'setState',
        payload: {
          goodsGroups: data1.result.data,
          colors: data2.result.data.skuattributes.data,
          sizeLibrarys: data3.result.data.skuattributes.data,
          units: data4.result.data,
          priceGrades: data5.result.data,
          shops: data7.result.data,
          warehouses: data8.result.data,
        } });
      yield put({ type: 'setpriceQuantityStepState', payload: data6.result.data });
    },

  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setpriceQuantityStepState(state, { payload }) {
      state.priceQuantitySteps = payload.map((item) => {
        return {
          id: `${item.id}`,
          name: item.quantityranges.data.map((item) => {
            return `${item.min}~`;
          }).join(''),
          quantityranges: item.quantityranges.data,
        };
      });
      return { ...state };
    },

  },

};
