import * as goodsService from '../services/goods'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router';
import {message} from 'antd'

export default  {

  namespace: 'goodsCreateOrEdit',

  state: {
    serverData: {},
    showData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({pathname}) => {
        const match = pathToRegexp('/goods-edit/:id').exec(location.hash.slice(1,location.hash.length))
        if(match) {
          dispatch({type:'setState',payload:{showData:{}}})
          //商品新建或编辑所需的关联数据
          dispatch({type:'commonData/getGoodsCreateOrEdit'})
          //单个商品的数据
          dispatch({type:'getSingleGoods',payload:{id:match[1]}})
        }else {
          if(pathname === '/goods-create') {
            dispatch({type:'setState',payload:{showData:{}}})
            dispatch({type:'commonData/getGoodsCreateOrEdit'})
          }
        }
      })
    },
  },

  effects: {
    *createSingleGoods({payload},{call,put,select}) {
      const {serverData} = yield select(({goodsCreateOrEdit}) => goodsCreateOrEdit)
      const data = yield call(goodsService.createSingle,serverData)
      yield put(routerRedux.push('/goods-list'));
    },

    *getSingleGoods({payload},{call,put,select}) {
      const data = yield call(goodsService.getSingle,payload)
      const {usePricelelvel,priceModel,itemBarcodeLevel} = yield select(({configSetting}) => configSetting)
      yield put({type:'setShowData',payload:{
        value:data.result.data,
        usePricelelvel,
        priceModel,
        itemBarcodeLevel
      }})
    },
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setShowData (state,{payload:{value,usePricelelvel,priceModel,itemBarcodeLevel}}) {
      console.log(value)
      state.showData.item_ref = value.item_ref;
      state.showData.standard_price = value.standard_price;
      state.showData.purchase_price = value.purchase_price;
      let priceMatrix = [...value.itemprices.data];
      priceMatrix = priceMatrix.splice(0,priceMatrix.length-1);
      state.showData.prices = {};
      if(usePricelelvel == 'yes') {
        if(priceModel == '') {
          priceMatrix.forEach( item => {
            state.showData.prices[`${item.pricelevel_id}`] = {
              price:item.price
            }
          })
        }else if(priceModel == 'shop') {
          priceMatrix.forEach( item => {
            state.showData.prices[`${item.shop_id}_${item.pricelevel_id}`] = {
              price:item.price
            }
          })
        }else if(priceModel == 'unit') {
          priceMatrix.forEach( item => {
            stata.showData.prices[`${item.unit_id}_${item.pricelevel_id}`] = {
              price:item.price
            }
          })
        }else if(priceModel == 'quantityrange') {
          priceMatrix.forEach( item => {
            state.showData.prices[`${item.quantityrange_id}_${item.pricelevel_id}`] = {
              price:item.price
            }
          })
        }
      }else {
        if(priceModel == 'shop') {
          priceMatrix.forEach( item => {
            state.showData.prices[`${item.shop_id}`] = {
              price: item.price
            }
          })
        }else if(priceModel == 'unit') {
          priceMatrix.forEach( item => {
            state.showData.prices[`${item.unit_id}`] = {
              price: item.price
            }
          })
        }else if(priceModel == 'quantityrange') {
          priceMatrix.forEach( item => {
            state.showData.prices[`${item.quantityrange_id}`] = {
              price: item.price
            }
          })
        }
      }
      state.showData.units = value.units.data.map( item => {
        return (item.id).toString()
      })
      state.showData.name = value.name;
      state.showData.desc = value.desc;
      state.showData.goodsGroup = {};
      let alreadyExitItemGroups = []
      value.itemgroups.data.forEach( item => {
        if(alreadyExitItemGroups.some( n => n == item.parent_id)) {
          state.showData.goodsGroup[`${item.parent_id}`].push((item.id).toString())
        }else {
          alreadyExitItemGroups.push(item.parent_id)
          state.showData.goodsGroup[`${item.parent_id}`] = [];
          state.showData.goodsGroup[`${item.parent_id}`].push((item.id).toString())
        }
      })
      state.showData.colors = [];
      state.showData.sizes = [];
      value.skus.data.forEach( item => {
        item.skuattributes.data.forEach( subItem => {
          if(subItem.skuattributetype_id == '1') {
            if(!state.showData.colors.some( n => n == subItem.id)) {
              state.showData.colors.push((subItem.id).toString())
            }
          }else if(subItem.skuattributetype_id == '2') {
            if(!state.showData.sizes.some( n => n == subItem.id)) {
              state.showData.sizes.push((subItem.id).toString())
            }
          }
        })
      }) 
      state.showData.stocks = {};
      state.showData.barcode = {}
      if(state.showData.colors.length == 0) {
        value.skus.data.forEach( item => {
          item.skustocks.data.forEach( subItem => {
            state.showData.stocks[`${subItem.warehouse_id}`] = {
              store_quantity : subItem.store_quantity
            }
          })
          state.showData.barcode = {
            barcode: item.barcode
          }
        })
      }else {
        if(state.showData.sizes.length == 0) {
          value.skus.data.forEach( item => {
            let colorId = ''
            item.skuattributes.data.forEach( subItem => {
              if(subItem.skuattributetype_id == '1') {
                colorId = subItem.id;
              }
            })
            item.skustocks.data.forEach( subItem => {
              state.showData.stocks[`${subItem.warehouse_id}_${colorId}`] = {
                store_quantity : subItem.store_quantity
              }
            })
            state.showData.barcode[`${colorId}`] = {
              barcode: item.barcode
            }
          })
        }else {
          value.skus.data.forEach( item => {
            let colorId = '',sizeId = ''
            item.skuattributes.data.forEach( subItem => {
              if(subItem.skuattributetype_id == '1') {
                colorId = subItem.id;
              }else {
                sizeId = subItem.id;
              }
            })
            item.skustocks.data.forEach( subItem => {
              state.showData.stocks[`${subItem.warehouse_id}_${colorId}_${sizeId}`] = {
                store_quantity : subItem.store_quantity
              }
            })
            state.showData.barcode[`${colorId}_${sizeId}`] = {
              barcode: item.barcode
            }
          })
        }
      }
      console.log(state.showData)
      return {...state}
    },

    setServerData (state,{payload:{value,selectUnits,warehouses,itemBarcodeLevel,itemImageLevel}}) {
      console.log(value)
      state.serverData = {}
      state.serverData.item_ref = value.item_ref;
      state.serverData.purchase_price = value.purchase_price || '';
      state.serverData.units = selectUnits.map( item => {
        return {
          id: item.id,
          number: item.number
        }
      })
      state.serverData.name = value.name || '';
      state.serverData.desc = value.desc || '';
      state.serverData.prices = Object.values(value.prices_table)
      state.serverData.prices.push({
        price: value.standard_price
      })
      state.serverData.itemgroup_ids = [];
      Object.values(value.goods_group || {}).forEach( item => {
        state.serverData.itemgroup_ids = state.serverData.itemgroup_ids.concat(...item)
      })
      state.serverData.skus = [];
      if(value.color_select.length === 0 && value.size_select.length === 0 ) {
        state.serverData.dimension = []
        state.serverData.skus.push({
          barcode: itemBarcodeLevel === 1 ? value.barcode.barcode : '' ,
          attributes: [],
          images: [],
          stocks: []
        })
        state.serverData.skus.forEach( item => {
          warehouses.forEach( subItem => {
            item.stocks.push({
              warehouse_id: value.stock[`${subItem.id}`].warehouse_id,
              store_quantity: value.stock[`${subItem.id}`].store_quantity
            })
          })
        })
      }else if(value.color_select.length !== 0 && value.size_select.length === 0) {
        state.serverData.dimension = [1]
        value.color_select.forEach( colorId => {
          state.serverData.skus.push({
            barcode: itemBarcodeLevel === 1 ? value.barcode[`${colorId}`].barcode : '',
            attributes: [{
              attributetype_id: 1,
              attribute_id: colorId
            }],
            images: [],
            stocks: []
          })
        })
        state.serverData.skus.forEach( item => {
          value.color_select.forEach( colorId => {
            if(item.attributes[0].attribute_id == colorId) {
              warehouses.forEach( subItem => {
                item.stocks.push({
                  warehouse_id: value.stock[`${subItem.id}_${colorId}`].warehouse_id,
                  store_quantity: value.stock[`${subItem.id}_${colorId}`].store_quantity
                })
              })
            }
          })
        })
      }else if(value.color_select.length !== 0 && value.size_select !== 0) {
        state.serverData.dimension = [1,2]
        value.color_select.forEach( colorId => {
          value.size_select.forEach( sizeId => {
            state.serverData.skus.push({
              barcode: itemBarcodeLevel === 1 ? value.barcode[`${colorId}_${sizeId}`].barcode : '',
              attributes: [{
                attributetype_id: 1,
                attribute_id: colorId
              },{
                attributetype_id: 2,
                attribute_id: sizeId
              }],
              images: [],
              stocks: []
            })
          })
        })
        state.serverData.skus.forEach( item => {
          value.color_select.forEach( colorId => {
            value.size_select.forEach( sizeId => {
              if(item.attributes[0].attribute_id == colorId && item.attributes[1].attribute_id == sizeId) {
                warehouses.forEach( subItem => {
                  item.stocks.push({
                    warehouse_id: value.stock[`${subItem.id}_${colorId}_${sizeId}`].warehouse_id,
                    store_quantity: value.stock[`${subItem.id}_${colorId}_${sizeId}`].store_quantity
                  })
                })
              }
            })
          })
        })
      }
      // itemImageLevel === 'item' ? state.serverData.image
      itemBarcodeLevel === 0 ? state.serverData.barcode = value.barcode.barcode : null
      console.log(state.serverData)
      return {...state}
    }

  },

};
