import * as goodsService from '../services/goods';
import * as pictureService from '../services/picture';
import { imageApiBase } from '../common/index';
import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';

export default {

  namespace: 'goodsCreateOrEdit',

  state: {
    serverData: {}, // 服务端的数据
    showData: {}, // 展示的数据
    imageFile: [], // 图片的数据
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *createSingleGoods({ payload }, { call, put, select }) {
      yield call(goodsService.createSingle, payload.serverData);
      for (let i = 0; i < payload.imageFile.length; i++) {
        yield call(pictureService.upload, payload.imageFile[i]);
      }
    },

    *getSingleGoods({ payload }, { call, put, select }) {
      const data = yield call(goodsService.getSingle, payload);
      const { usePricelelvel, priceModel, itemBarcodeLevel, itemImageLevel } = yield select(({ configSetting }) => configSetting);
      if (data.code && data.code != 0) {
        message.error(data.message);
      } else {
        yield put({ type: 'setShowData',
          payload: {
            value: data.result.data,
            itemimage: data.result.itemimage_names || [],
            usePricelelvel,
            priceModel,
            itemBarcodeLevel,
            itemImageLevel,
          } });
      }
    },

    *editSingleGoods({ payload }, { call, put }) {
      yield call(goodsService.editSingle, { serverData: payload.serverData, id: payload.id });
      for (let i = 0; i < payload.imageFile.length; i++) {
        yield call(pictureService.upload, payload.imageFile[i]);
      }
    },

    *checkItemRef({ payload }, { call, put }) {
      const data = yield call(goodsService.checkItemRef, payload);
      return data;
    },
  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setShowData(state, { payload: { value, itemimage, usePricelelvel, priceModel, itemBarcodeLevel, itemImageLevel } }) {
      state.showData.id = value.id; //商品id
      state.showData.item_ref = value.item_ref; //货号
      state.showData.standard_price = (value.standard_price).toString(); //标准价
      state.showData.purchase_price = (value.purchase_price).toString(); //进货价就
      let priceMatrix = [...value.itemprices.data];
      priceMatrix = priceMatrix.splice(0, priceMatrix.length - 1);
      state.showData.prices = {}; // 价格组成&价格等级
      let flag = false; //判断当前的价格组成的策略与数据相符合
      if (priceMatrix.length) {
        if (usePricelelvel == 'yes') {
          if (priceModel == '') {
            priceMatrix.forEach((item) => {
              if (item.pricelevel_id && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {
                state.showData.prices[`${item.pricelevel_id}`] = {
                  price: item.price,
                };
              } else if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {} else {
                flag = true;
              }
            });
          } else if (priceModel == 'shop') {
            priceMatrix.forEach((item) => {
              if (item.pricelevel_id && item.shop_id && item.unit_id == null && item.quantityrange_id == null) {
                state.showData.prices[`${item.shop_id}_${item.pricelevel_id}`] = {
                  price: item.price,
                };
              } else if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {} else {
                flag = true;
              }
            });
          } else if (priceModel == 'unit') {
            priceMatrix.forEach((item) => {
              if (item.pricelevel_id && item.shop_id == null && item.unit_id && item.quantityrange_id == null) {
                stata.showData.prices[`${item.unit_id}_${item.pricelevel_id}`] = {
                  price: item.price,
                };
              } else if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {} else {
                flag = true;
              }
            });
          } else if (priceModel == 'quantityrange') {
            priceMatrix.forEach((item) => {
              if (item.pricelevel_id && item.shop_id == null && item.unit_id == null && item.quantityrange_id) {
                state.showData.prices[`${item.quantityrange_id}_${item.pricelevel_id}`] = {
                  price: item.price,
                };
              } else if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {} else {
                flag = true;
              }
            });
          }
        } else if (priceModel == 'shop') {
          priceMatrix.forEach((item) => {
            if (item.pricelevel_id == null && item.shop_id && item.unit_id == null && item.quantityrange_id == null) {
              state.showData.prices[`${item.shop_id}`] = {
                price: item.price,
              };
            } else if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {} else {
              flag = true;
            }
          });
        } else if (priceModel == 'unit') {
          priceMatrix.forEach((item) => {
            if (item.pricelevel_id == null && item.shop_id == null && item.unit_id && item.quantityrange_id == null) {
              state.showData.prices[`${item.unit_id}`] = {
                price: item.price,
              };
            } else if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {} else {
              flag = true;
            }
          });
        } else if (priceModel == 'quantityrange') {
          priceMatrix.forEach((item) => {
            if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id) {
              state.showData.prices[`${item.quantityrange_id}`] = {
                price: item.price,
              };
            } else if (item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {} else {
              flag = true;
            }
          });
        }
      } else {
        flag = true;
      }
      if (flag) {
        state.showData.prices = {
          price: (value.standard_price).toString(),
        };
      }
      // 基本价格组成为quantityrange & 数据相符合，生成selectQuantityStep
      if (priceModel == 'quantityrange' && !flag) {
        state.showData.selectQuantityStep = value.quantityrangegroup.data.quantityranges.data.map((item, index) => {
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
      }
      // 选择的单位
      state.showData.selectUnits = value.units.data.map((item) => {
        return {
          id: item.id,
          name: `${item.name} x ( ${Number(item.number)} )`,
          number: item.number,
        };
      });
      // 多选框的单位
      state.showData.units = value.units.data.map((item) => {
        return (item.id).toString();
      });
      state.showData.name = value.name; //名称
      state.showData.desc = value.desc; //备注
      state.showData.goodsGroup = {}; //商品分组
      let alreadyExitItemGroups = [];
      value.itemgroups.data.forEach((item) => {
        if (alreadyExitItemGroups.some(n => n == item.parent_id)) {
          state.showData.goodsGroup[`${item.parent_id}`].push(item.id);
        } else {
          alreadyExitItemGroups.push(item.parent_id);
          state.showData.goodsGroup[`${item.parent_id}`] = [];
          state.showData.goodsGroup[`${item.parent_id}`].push(item.id);
        }
      });
      state.showData.colors = []; // 多选框的颜色
      state.showData.sizes = []; // 多选框的尺码
      state.showData.selectColors = []; // 选择的颜色
      state.showData.selectSizes = []; // 选择的尺码
      value.skus.data.forEach((item) => {
        item.skuattributes.data.forEach((subItem) => {
          if (subItem.skuattributetype_id == '1') {
            if (!state.showData.colors.some(n => n == subItem.id)) {
              state.showData.colors.push((subItem.id).toString());
              state.showData.selectColors.push({
                id: subItem.id,
                name: subItem.name,
              });
            }
          } else if (subItem.skuattributetype_id == '2') {
            if (!state.showData.sizes.some(n => n == subItem.id)) {
              state.showData.sizes.push((subItem.id).toString());
              state.showData.selectSizes.push({
                id: subItem.id,
                name: subItem.name,
              });
            }
          }
        });
      });
      state.showData.imageFile = {}; //图片
      state.showData.stocks = {}; //库存
      state.showData.barcodes = {}; //条码
      state.showData.barcodeId = {}; //skuId
      state.showData.imageFile = {};
      if (state.showData.colors.length == 0) {
        value.skus.data.forEach((item) => {
          item.skustocks.data.forEach((subItem) => {
            state.showData.stocks[`${subItem.warehouse_id}`] = {
              store_quantity: subItem.store_quantity,
            };
          });
          state.showData.barcodes = {
            barcode: itemBarcodeLevel == 1 ? item.barcode : '',
          };
          state.showData.barcodeId = {
            id: item.id,
          };
        });
      } else if (state.showData.sizes.length == 0) {
        value.skus.data.forEach((item) => {
          let colorId = '';
          item.skuattributes.data.forEach((subItem) => {
            if (subItem.skuattributetype_id == '1') {
              colorId = subItem.id;
            }
          });
          // 生成库存数据
          item.skustocks.data.forEach((subItem) => {
            state.showData.stocks[`${subItem.warehouse_id}_${colorId}`] = {
              store_quantity: subItem.store_quantity,
            };
          });
          // 生成条码数据
          state.showData.barcodes[`${colorId}`] = {
            barcode: itemBarcodeLevel == 1 ? item.barcode : '',
          };
          state.showData.barcodeId[`${colorId}`] = {
            id: item.id,
          };
          // 图片策略为sku 生成图片数据
          if (itemImageLevel == 'sku') {
            item.skuimages && item.skuimages.data.forEach((subItem) => {
              state.showData.imageFile[`${colorId}`] = [];
              state.showData.imageFile[`${colorId}`].push({
                uid: Number(`-${window.crypto.getRandomValues(new Uint32Array(1))[0].toString()}`),
                url: subItem.url,
                name: subItem.name,
                status: 'done',
              });
            });
          }
        });
      } else {
        value.skus.data.forEach((item) => {
          let colorId = '',
            sizeId = '';
          item.skuattributes.data.forEach((subItem) => {
            if (subItem.skuattributetype_id == '1') {
              colorId = subItem.id;
            } else {
              sizeId = subItem.id;
            }
          });
          item.skustocks.data.forEach((subItem) => {
            state.showData.stocks[`${subItem.warehouse_id}_${colorId}_${sizeId}`] = {
              store_quantity: subItem.store_quantity,
            };
          });
          // 生成库存数据
          state.showData.barcodes[`${colorId}_${sizeId}`] = {
            barcode: itemBarcodeLevel == 1 ? item.barcode : '',
          };
          // 生成条码数据
          state.showData.barcodeId[`${colorId}_${sizeId}`] = {
            id: item.id,
          };
          // 图片策略为sku 生成图片数据
          if (itemImageLevel == 'sku') {
            item.skuimages && item.skuimages.data.forEach((subItem) => {
              state.showData.imageFile[`${colorId}`] = [];
              state.showData.imageFile[`${colorId}`].push({
                uid: Number(`-${window.crypto.getRandomValues(new Uint32Array(1))[0].toString()}`),
                url: subItem.url,
                name: subItem.name,
                status: 'done',
              });
            });
          }
        });
      }
      itemBarcodeLevel == 0 ? state.showData.barcodes.barcode = value.barcode : '';
      // 图片策略为item 生成图片数据
      if (itemImageLevel == 'item') {
        state.showData.imageFile = [];
        itemimage.forEach((item) => {
          state.showData.imageFile.push({
            uid: Number(`-${window.crypto.getRandomValues(new Uint32Array(1))[0].toString()}`),
            url: `${imageApiBase}/${item}`,
            name: item,
            status: 'done',
          });
        });
      }
      console.log(state.showData)
      return { ...state };
    },


    setServerData(state, { payload: { value, selectColors, selectUnits, selectQuantityStep, warehouses, priceModel, itemBarcodeLevel, itemImageLevel } }) {      itemImageLevel === 'item' ? state.serverData.itemimages = picture.fileName : null;
      itemBarcodeLevel === 0 ? state.serverData.barcode = value.barcode.barcode : null;
      return { ...state };
    },

  },

};
