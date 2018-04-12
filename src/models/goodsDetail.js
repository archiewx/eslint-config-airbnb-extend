import * as goodsService from '../services/goods';
import { message } from 'antd';
import moment from 'moment';
import * as customerGroupService from '../services/customerGroup';
import { imageApiBase } from '../common/index.js';

export default {

  namespace: 'goodsDetail',

  state: {
    singleGoodsDetail: {},
    singleGoodsSales: [],
    singleGoodsPurchases: [],
    singleGoodsCustomers: [],
    singleGoodsSuppliers: [],
    singleGoodsStocks: [],
    filterSaleServerData: {},
    filterPurchaseServerData: {},
    filterCustomerServerData: {},
    filterSupplierServerData: {},
    filterStockServerData: {},
    singleCustomerMode: [],
    currentId: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getSingle({ payload }, { call, put, select, all }) {
      const condition = {
        date_type: 'custom',
        sday: moment(new Date((new Date()).getTime() - 7 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD').format('YYYY-MM-DD'),
        eday: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
        id: payload.id,
      };
      const condition2 = {
        date_type: 'custom',
        sday: moment(new Date((new Date()).getTime() - 7 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD').format('YYYY-MM-DD'),
        eday: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
        id: payload.id,
        mode: 'customer',
      };
      const [data1, data2, data3, data4, data5, data6, data7] = yield all([
        call(goodsService.getSingle, payload),
        call(goodsService.getSingleSales, condition),
        call(goodsService.getSinglePurchases, condition),
        call(goodsService.getSingleCustomers, condition2),
        call(goodsService.getSingleSuppliers, condition),
        call(goodsService.getSingleStocks, condition),
        call(customerGroupService.getList),
      ]);
      const { usePricelelvel, priceModel, itemImageLevel } = yield select(({ configSetting }) => (configSetting));
      if (data1.code && data1.code != 0) {
        message.error(data1.message);
      } else {
        yield put({ type: 'setsingleGoodsDetail',
          payload: {
            value: data1.result.data,
            itemimage: data1.result.itemimage_names || [],
            usePricelelvel,
            priceModel,
            itemImageLevel,
          } });
        yield put({ type: 'setShowSaleList', payload: data2.result.data.list });
        yield put({ type: 'setShowPurchaseList', payload: data3.result.data.list });
        yield put({ type: 'setShowStockList', payload: data6.result.data.list });
        yield put({ type: 'setShowCustomerList', payload: data4.result.data });
        yield put({ type: 'setState',
          payload: {
            singleGoodsSuppliers: data5.result.data.list,
            currentId: payload,
          } });
        yield put({ type: 'setShowCustomerMode', payload: data7.result.data });
      }
    },

    *deleteSingleGoods({ payload }, { call, put }) {
      yield call(goodsService.deleteSingleGoods, payload);
    },

    *changeGoodsStatus({ payload }, { call, put }) {
      const data = yield call(goodsService.changeGoodsStatus, payload);
      yield put({ type: 'getSingleMessage', payload });
    },

    *getSingleMessage({ payload }, { call, put }) {
      const data = yield call(goodsService.getSingle, payload);
      yield put({ type: 'setsingleGoodsDetail',
        payload: {
          value: data.result.data,
        } });
    },

    *getSingleSales({ payload }, { call, put }) {
      const data = yield call(goodsService.getSingleSales, payload);
      yield put({ type: 'setShowSaleList', payload: data.result.data.list });
    },

    *getSinglePurchases({ payload }, { call, put }) {
      const data = yield call(goodsService.getSinglePurchases, payload);
      yield put({ type: 'setShowPurchaseList', payload: data.result.data.list });
    },

    *getSingleCustomers({ payload }, { call, put }) {
      const data = yield call(goodsService.getSingleCustomers, payload);
      yield put({ type: 'setShowCustomerList', payload: data.result.data });
    },

    *getSingleSuppliers({ payload }, { call, put }) {
      const data = yield call(goodsService.getSingleSuppliers, payload);
      yield put({ type: 'setState',
        payload: {
          singleGoodsSuppliers: data.result.data.list,
        } });
    },

    *getSingleStocks({ payload }, { call, put }) {
      const data = yield call(goodsService.getSingleStocks, payload);
      yield put({ type: 'setShowStockList', payload: data.result.data.list });
    },
  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setsingleGoodsDetail(state, { payload: { value, itemimage, usePricelelvel, priceModel, itemImageLevel } }) {
      console.log(value)
      state.singleGoodsDetail = {};
      state.singleGoodsDetail.item_ref = value.item_ref; // 货号
      state.singleGoodsDetail.not_sale = value.not_sale; // 在售出售
      state.singleGoodsDetail.purchase_price = value.purchase_price; // 进货价
      state.singleGoodsDetail.standard_price = value.standard_price; // 标准价
      state.singleGoodsDetail.name = value.name || '无'; // 名称
      state.singleGoodsDetail.desc = value.desc || '无'; // 备注

      const priceMatrix = [...value.itemprices.data];
      state.singleGoodsDetail.prices = {}; // 价格等级价格组成
      let flag = false; // 判断数据是否与策略相符合
      if (priceMatrix.length) {
        if (usePricelelvel == 'yes') {
          if (priceModel == '') {
            priceMatrix.forEach((item) => {
              if (item.pricelevel_id && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {
                state.singleGoodsDetail.prices[`${item.pricelevel_id}`] = {
                  price: item.price,
                };
              } else if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {
                flag = false;
              } else {
                flag = true;
              }
            });
          } else if (priceModel == 'shop') {
            priceMatrix.forEach((item) => {
              if (item.pricelevel_id && item.shop_id && item.unit_id == null && item.quantityrange_id == null) {
                state.singleGoodsDetail.prices[`${item.shop_id}_${item.pricelevel_id}`] = {
                  price: item.price,
                };
              } else if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {
                flag = false;
              } else {
                flag = true;
              }
            });
          } else if (priceModel == 'unit') {
            priceMatrix.forEach((item) => {
              if (item.pricelevel_id && item.shop_id == null && item.unit_id && item.quantityrange_id == null) {
                state.singleGoodsDetail.prices[`${item.unit_id}_${item.pricelevel_id}`] = {
                  price: item.price,
                };
              } else if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {
                flag = false;
              } else {
                flag = true;
              }
            });
          } else if (priceModel == 'quantityrange') {
            priceMatrix.forEach((item) => {
              if (item.pricelevel_id && item.shop_id == null && item.unit_id == null && item.quantityrange_id) {
                state.singleGoodsDetail.prices[`${item.quantityrange_id}_${item.pricelevel_id}`] = {
                  price: item.price,
                };
              } else if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {
                flag = false;
              } else {
                flag = true;
              }
            });
          }
        }
        // else if (priceModel == 'shop') {
        //   priceMatrix.forEach((item) => {
        //     if (item.pricelevel_id == null && item.shop_id && item.unit_id == null && item.quantityrange_id == null) {
        //       state.singleGoodsDetail.prices[`${item.shop_id}`] = {
        //         price: item.price,
        //       };
        //     } else if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {
        //       flag = true;
        //     } else {
        //       flag = true;
        //     }
        //   });
        // } else if (priceModel == 'unit') {
        //   priceMatrix.forEach((item) => {
        //     if (item.pricelevel_id == null && item.shop_id == null && item.unit_id && item.quantityrange_id == null) {
        //       state.singleGoodsDetail.prices[`${item.unit_id}`] = {
        //         price: item.price,
        //       };
        //     } else if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {
        //       flag = true;
        //     } else {
        //       flag = true;
        //     }
        //   });
        // } else if (priceModel == 'quantityrange') {
        //   priceMatrix.forEach((item) => {
        //     if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id) {
        //       state.singleGoodsDetail.prices[`${item.quantityrange_id}`] = {
        //         price: item.price,
        //       };
        //     } else if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {
        //       flag = true;
        //     } else {
        //       flag = true;
        //     }
        //   });
        // }
      } else {
        flag = true;
      }
      if (flag) {
        state.singleGoodsDetail.hidePriceTable = true;
      } else {
        state.singleGoodsDetail.hidePriceTable = false;
        state.singleGoodsDetail.priceGrades = [];
        state.singleGoodsDetail.selectShops = [];
        state.singleGoodsDetail.selectUnits = [];
        state.singleGoodsDetail.selectQuantityStep = [];
        value.itemprices.data.forEach((item) => {
          if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {}
          else if (!state.singleGoodsDetail.priceGrades.some(n => n.id == item.pricelevel.data.id)) {
            state.singleGoodsDetail.priceGrades.push({
              id: item.pricelevel.data.id,
              name: item.pricelevel.data.name,
            });
          }
        });
        if (priceModel == 'quantityrange') {
          state.singleGoodsDetail.selectQuantityStep = value.quantityrangegroup.data.quantityranges.data.map((item, index) => {
            let name;
            if (item.max == -1) {
              name = `${item.min} ~`;
            } else {
              name = `${item.min} ~ ${item.max - 1}`;
            }
            return {
              id: item.id,
              name,
            };
          });
        } else if (priceModel == 'unit') {
          state.singleGoodsDetail.selectUnits = value.units.data.map((item) => {
            return {
              id: item.id,
              name: `${item.name} x ( ${item.number} )`,
              number: item.number,
            };
          });
        } else if (priceModel == 'shop') {
          value.itemprices.data.forEach((item) => {
            if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {} else if (!state.singleGoodsDetail.selectShops.some(n => n.id == item.shop.data.id)) {
              state.singleGoodsDetail.selectShops.push({
                id: item.shop.data.id,
                name: item.shop.data.name,
              });
            }
          });
        }
      }
      state.singleGoodsDetail.units = value.units.data.map(item => (`${item.name} x ( ${item.number} )`)).join('、'); // 单位
      let colors = [], // 颜色
        sizes = []; // 尺码
      state.singleGoodsDetail.images = []; // 图片
      value.skus.data.forEach((item) => {
        item.skuattributes.data.forEach((subItem) => {
          if (subItem.skuattributetype_id === '1') {
            if (!colors.some(colorItem => colorItem.id === subItem.id)) {
              colors.push({
                name: subItem.name,
                id: subItem.id,
              });
            }
          }
          if (subItem.skuattributetype_id === '2') {
            if (!sizes.some(sizeItem => sizeItem.id === subItem.id)) {
              sizes.push({
                name: subItem.name,
                id: subItem.id,
              });
            }
          }
        });
        // 图片策略为sku
        if (itemImageLevel == 'sku') {
          item.skuimages && item.skuimages.data.forEach((subItem) => {
            state.singleGoodsDetail.images.push({
              name: subItem.name,
              url: subItem.url,
              id: subItem.id,
            });
          });
        }
      });
      // 图片策略为item
      if (itemImageLevel == 'item') {
        state.singleGoodsDetail.images = itemimage.map((item, index) => {
          return {
            url: `${imageApiBase}/${item}`,
            name: item,
            id: index,
          };
        });
      }
      state.singleGoodsDetail.colors = colors.map(item => item.name).join('、');
      state.singleGoodsDetail.sizes = sizes.map(item => item.name).join('、');
      state.singleGoodsDetail.goodsGroup = value.itemgroups.data.map(item => item.name).join('、');
      return { ...state };
    },

    setShowCustomerMode(state, { payload }) {
      state.singleCustomerMode = [];
      state.singleCustomerMode.push({
        name: '不分组',
        mode: 'customer',
      });
      state.singleCustomerMode.push({
        name: '客户等级',
        mode: 'vip',
      });
      payload.forEach((item) => {
        state.singleCustomerMode.push({
          name: item.name,
          mode: `customergroup_${item.id}`,
        });
      });
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

    setFilterPurchaseServerData(state, { payload }) {
      const current = {};
      for (const key in payload) {
        if (key.indexOf('purchase_') == 0) {
          if (payload[key]) {
            const name = key.slice(9, key.length);
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
      state.filterPurchaseServerData = current;
      return { ...state };
    },

    setFilterCustomerServerData(state, { payload }) {
      const current = {};
      for (const key in payload) {
        if (key.indexOf('customer_') == 0) {
          if (payload[key]) {
            const name = key.slice(9, key.length);
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
      state.filterCustomerServerData = current;
      return { ...state };
    },

    setFilterSupplierServerData(state, { payload }) {
      const current = {};
      for (const key in payload) {
        if (key.indexOf('supplier_') == 0) {
          if (payload[key]) {
            const name = key.slice(9, key.length);
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
      state.filterSupplierServerData = current;
      return { ...state };
    },

    setFilterStockServerData(state, { payload }) {
      const current = {};
      for (const key in payload) {
        if (key.indexOf('stock_') == 0) {
          if (payload[key]) {
            const name = key.slice(9, key.length);
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
      state.filterStockServerData = current;
      return { ...state };
    },

    setShowCustomerList(state, { payload }) {
      // 客户列表数据包括散客
      const current = [];
      current.push(payload.guest);
      state.singleGoodsCustomers = [].concat(current, payload.list);
      return { ...state };
    },

    setShowSaleList(state, { payload }) {
      state.singleGoodsSales = [];
      const expandedRowRender = {};
      if (payload.length === 0) {
        state.singleGoodsSales = payload;
      } else {
        // 销售列表的sku有3个形式，1: 无颜色无尺码 2: 有颜色无尺码 3:有颜色有尺码
        payload.forEach((item, index) => {
          if (item.skuattributes.length == 0) {
            state.singleGoodsSales.push({
              id: item.id,
              sales_quantity: item.sales_quantity,
              sales_amount: item.sales_amount,
              profit: item.profit,
              stock_quantity: item.stock_quantity,
            });
          } else if (item.skuattributes.length == 1) {
            state.singleGoodsSales.push({
              id: item.id,
              name: item.skuattributes[0].name,
              sales_quantity: item.sales_quantity,
              sales_amount: item.sales_amount,
              profit: item.profit,
              stock_quantity: item.stock_quantity,
            });
          } else if (item.skuattributes.length == 2) {
            if (state.singleGoodsSales.some(n => n.id == item.skuattributes[0].id)) {
              expandedRowRender[`${item.skuattributes[0].id}`].push({
                id: `${item.skuattributes[1].id}_${index}`,
                name: item.skuattributes[1].name,
                sales_quantity: item.sales_quantity,
                sales_amount: item.sales_amount,
                profit: item.profit,
                stock_quantity: item.stock_quantity,
              });
            } else {
              state.singleGoodsSales.push({
                id: item.skuattributes[0].id,
                name: item.skuattributes[0].name,
                sales_quantity: 0,
                sales_amount: 0,
                profit: 0,
                stock_quantity: 0,
                children: [],
              });
              expandedRowRender[`${item.skuattributes[0].id}`] = [];
              expandedRowRender[`${item.skuattributes[0].id}`].push({
                id: `${item.skuattributes[1].id}_${index}`,
                name: item.skuattributes[1].name,
                sales_quantity: item.sales_quantity,
                sales_amount: item.sales_amount,
                profit: item.profit,
                stock_quantity: item.stock_quantity,
              });
            }
          }
        });
        // 有颜色有尺码
        if (Object.values(expandedRowRender).length != 0) {
          state.singleGoodsSales.forEach((item) => {
            item.children = expandedRowRender[item.id];
            item.sales_quantity = expandedRowRender[item.id].reduce((sum, item) => (sum + Number(item.sales_quantity)), 0);
            item.sales_amount = expandedRowRender[item.id].reduce((sum, item) => (sum + Number(item.sales_amount)), 0);
            item.profit = expandedRowRender[item.id].reduce((sum, item) => (sum + Number(item.profit)), 0);
            item.stock_quantity = expandedRowRender[item.id].reduce((sum, item) => (sum + Number(item.stock_quantity)), 0);
          });
        }
      }
      return { ...state };
    },

    setShowPurchaseList(state, { payload }) {
      state.singleGoodsPurchases = [];
      const expandedRowRender = {};
      if (payload.length === 0) {
        state.singleGoodsPurchases = payload;
      } else {
        payload.forEach((item, index) => {
          if (item.skuattributes.length == 0) {
            state.singleGoodsPurchases.push({
              id: item.id,
              purchase_quantity: item.purchase_quantity,
              purchase_amount: item.purchase_amount,
              stock_quantity: item.stock_quantity,
            });
          } else if (item.skuattributes.length == 1) {
            state.singleGoodsPurchases.push({
              id: item.id,
              name: item.skuattributes[0].name,
              purchase_quantity: item.purchase_quantity,
              purchase_amount: item.purchase_amount,
              stock_quantity: item.stock_quantity,
            });
          } else if (item.skuattributes.length == 2) {
            if (state.singleGoodsPurchases.some(n => n.id == item.skuattributes[0].id)) {
              expandedRowRender[`${item.skuattributes[0].id}`].push({
                id: `${item.skuattributes[1].id}_${index}`,
                name: item.skuattributes[1].name,
                purchase_quantity: item.purchase_quantity,
                purchase_amount: item.purchase_amount,
                stock_quantity: item.stock_quantity,
              });
            } else {
              state.singleGoodsPurchases.push({
                id: item.skuattributes[0].id,
                name: item.skuattributes[0].name,
                purchase_quantity: item.purchase_quantity,
                purchase_amount: item.purchase_amount,
                stock_quantity: item.stock_quantity,
                children: [],
              });
              expandedRowRender[`${item.skuattributes[0].id}`] = [];
              expandedRowRender[`${item.skuattributes[0].id}`].push({
                id: `${item.skuattributes[1].id}_${index}`,
                name: item.skuattributes[1].name,
                purchase_quantity: item.purchase_quantity,
                purchase_amount: item.purchase_amount,
                stock_quantity: item.stock_quantity,
              });
            }
          }
        });
        if (Object.values(expandedRowRender).length != 0) {
          state.singleGoodsPurchases.forEach((item) => {
            item.children = expandedRowRender[item.id];
            item.purchase_quantity = expandedRowRender[item.id].reduce((sum, item) => (sum, Number(item.purchase_quantity)), 0);
            item.purchase_amount = expandedRowRender[item.id].reduce((sum, item) => (sum, Number(item.purchase_amount)), 0);
            item.stock_quantity = expandedRowRender[item.id].reduce((sum, item) => (sum, Number(item.stock_quantity)), 0);
          });
        }
      }
      return { ...state };
    },

    setShowStockList(state, { payload }) {
      state.singleGoodsStocks = [];
      const expandedRowRender = {};
      if (payload.length === 0) {
        state.singleGoodsStocks = payload;
      } else {
        payload.forEach((item, index) => {
          if (item.skuattributes.length == 0) {
            state.singleGoodsStocks.push({
              id: item.id,
              sales_quantity: item.sales_quantity,
              purchase_quantity: item.purchase_quantity,
              stock_quantity: item.stock_quantity,
            });
          } else if (item.skuattributes.length == 1) {
            state.singleGoodsStocks.push({
              id: item.id,
              name: item.skuattributes[0].name,
              sales_quantity: item.sales_quantity,
              purchase_quantity: item.purchase_quantity,
              stock_quantity: item.stock_quantity,
            });
          } else if (item.skuattributes.length == 2) {
            if (state.singleGoodsStocks.some(n => n.id == item.skuattributes[0].id)) {
              expandedRowRender[`${item.skuattributes[0].id}`].push({
                id: `${item.skuattributes[1].id}_${index}`,
                name: item.skuattributes[1].name,
                sales_quantity: item.sales_quantity,
                purchase_quantity: item.purchase_quantity,
                stock_quantity: item.stock_quantity,
              });
            } else {
              state.singleGoodsStocks.push({
                id: item.skuattributes[0].id,
                name: item.skuattributes[0].name,
                sales_quantity: item.sales_quantity,
                purchase_quantity: item.purchase_quantity,
                stock_quantity: item.stock_quantity,
                children: [],
              });
              expandedRowRender[`${item.skuattributes[0].id}`] = [];
              expandedRowRender[`${item.skuattributes[0].id}`].push({
                id: `${item.skuattributes[1].id}_${index}`,
                name: item.skuattributes[1].name,
                sales_quantity: item.sales_quantity,
                purchase_quantity: item.purchase_quantity,
                stock_quantity: item.stock_quantity,
              });
            }
          }
        });
        if (Object.values(expandedRowRender).length != 0) {
          state.singleGoodsStocks.forEach((item) => {
            item.children = expandedRowRender[item.id];
            item.sales_quantity = expandedRowRender[item.id].reduce((sum, item) => (sum + Number(item.sales_quantity)), 0);
            item.purchase_quantity = expandedRowRender[item.id].reduce((sum, item) => (sum + Number(item.purchase_quantity)), 0);
            item.stock_quantity = expandedRowRender[item.id].reduce((sum, item) => (sum + Number(item.stock_quantity)), 0);
          });
        }
      }
      return { ...state };
    },
  },
};
