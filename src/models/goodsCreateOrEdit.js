import * as goodsService from '../services/goods'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'goodsCreateOrEdit',

  state: {
    serverData: {},
    showData: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(()=>{
        dispatch({type:'setState',payload:{showData:{}}})
      })
    },
  },

  effects: {
    *createSingleGoods({payload},{call,put,select}) {
      const {serverData} = yield select(({goodsCreateOrEdit}) => goodsCreateOrEdit)
      yield call(goodsService.createSingle,serverData)
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

    *checkItemRef({payload},{call,put}) {
      const data = yield call(goodsService.checkItemRef,payload)
      return data
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setShowData (state,{payload:{value,usePricelelvel,priceModel,itemBarcodeLevel}}) {
      console.log(value)
      state.showData.id = value.id;
      state.showData.item_ref = value.item_ref;
      state.showData.standard_price = (value.standard_price).toString();
      state.showData.purchase_price = (value.purchase_price).toString();
      let priceMatrix = [...value.itemprices.data];
      priceMatrix = priceMatrix.splice(0,priceMatrix.length-1);
      state.showData.prices = {};
      let flag = false;
      if(usePricelelvel == 'yes') {
        if(priceModel == '') {
          priceMatrix.forEach( item => {
            if(priceMatrix[0].pricelevel_id && priceMatrix[0].shop_id == null && priceMatrix[0].unit_id == null && priceMatrix[0].quantityrange_id == null) {
              state.showData.prices[`${item.pricelevel_id}`] = {
                price:item.price
              }
            }else {
              flag = true;    
            }
          })
        }else if(priceModel == 'shop') {
          priceMatrix.forEach( item => {
            if(priceMatrix[0].pricelevel_id && priceMatrix[0].shop_id && priceMatrix[0].unit_id == null && priceMatrix[0].quantityrange_id == null) {
              state.showData.prices[`${item.shop_id}_${item.pricelevel_id}`] = {
                price:item.price
              }
            }else {
              flag = true;    
            }
          })
        }else if(priceModel == 'unit') {
          priceMatrix.forEach( item => {
            if(priceMatrix[0].pricelevel_id && priceMatrix[0].shop_id == null && priceMatrix[0].unit_id && priceMatrix[0].quantityrange_id == null) {
              stata.showData.prices[`${item.unit_id}_${item.pricelevel_id}`] = {
                price:item.price
              }
            }else {
              flag = true;    
            }
          })
        }else if(priceModel == 'quantityrange') {
          priceMatrix.forEach( item => {
            if(priceMatrix[0].pricelevel_id && priceMatrix[0].shop_id == null && priceMatrix[0].unit_id == null && priceMatrix[0].quantityrange_id) {
              state.showData.prices[`${item.quantityrange_id}_${item.pricelevel_id}`] = {
                price:item.price
              }
            }else {
              flag = true;    
            }
          })
        }
      }else {
        if(priceModel == 'shop') {
          priceMatrix.forEach( item => {
            if(priceMatrix[0].pricelevel_id == null && priceMatrix[0].shop_id  && priceMatrix[0].unit_id == null && priceMatrix[0].quantityrange_id == null) {
              state.showData.prices[`${item.shop_id}`] = {
                price: item.price
              } 
            }else {
              flag = true;    
            }
          })
        }else if(priceModel == 'unit') {
          priceMatrix.forEach( item => {
            if(priceMatrix[0].pricelevel_id == null && priceMatrix[0].shop_id == null && priceMatrix[0].unit_id && priceMatrix[0].quantityrange_id == null) {
              state.showData.prices[`${item.unit_id}`] = {
                price: item.price
              }
            }else {
              flag = true;    
            }
          })
        }else if(priceModel == 'quantityrange') {
          priceMatrix.forEach( item => {
            if(priceMatrix[0].pricelevel_id == null && priceMatrix[0].shop_id == null && priceMatrix[0].unit_id == null && priceMatrix[0].quantityrange_id ) {
              state.showData.prices[`${item.quantityrange_id}`] = {
                price: item.price
              }
            }else {
              flag = true;    
            }
          })
        }
      }
      if(flag) {
        state.showData.prices = {
          price: (value.standard_price).toString()
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
      state.showData.barcodes = {}
      if(state.showData.colors.length == 0) {
        value.skus.data.forEach( item => {
          item.skustocks.data.forEach( subItem => {
            state.showData.stocks[`${subItem.warehouse_id}`] = {
              store_quantity : subItem.store_quantity
            }
          })
          state.showData.barcodes = {
            barcode: itemBarcodeLevel == 1 ? item.barcode : ''
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
            state.showData.barcodes[`${colorId}`] = {
              barcode: itemBarcodeLevel == 1 ? item.barcode : ''
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
            state.showData.barcodes[`${colorId}_${sizeId}`] = {
              barcode: itemBarcodeLevel == 1 ? item.barcode : ''
            }
          })
        }
      }
      itemBarcodeLevel == 0 ? state.showData.barcodes.barcode = value.barcode : ''
      console.log(state.showData)
      return {...state}
    },

    setServerData (state,{payload:{value,selectUnits,selectQuantityStep,warehouses,priceModel,itemBarcodeLevel,itemImageLevel}}) {
      console.log(value)
      state.serverData = {}
      state.serverData.item_ref = value.item_ref;
      state.serverData.purchase_price = value.purchase_price || 0;
      state.serverData.prices = [];
      if(priceModel == '') {
        state.serverData.prices = Object.values(value.prices_table)
        state.serverData.prices.push({
          price: value.standard_price
        })
      }else if(priceModel == 'shop') {
        state.serverData.prices = Object.values(value.prices_table)
        state.serverData.prices.push({
          price: value.standard_price
        })
      }else if(priceModel == 'unit') {
        Object.values(value.prices_table).forEach( item => {
          if(value.unit_select.some( n => n == item.unit_id)) {
            state.serverData.prices.push(item)
          }
        })
        state.serverData.prices.push({
          price: value.standard_price
        })
      }else if(priceModel == 'quantityrange') {
        Object.values(value.prices_table).forEach( item => {
          if(selectQuantityStep.some( n => n.id == item.quantityrange_id)) {
            state.serverData.prices.push(item)
          }
        })
        state.serverData.prices.push({
          price: value.standard_price
        })
      }
      state.serverData.units = selectUnits.map( item => {
        return {
          id: item.id,
          number: item.number
        }
      })
      state.serverData.name = value.name || '';
      state.serverData.desc = value.desc || '';
      state.serverData.itemgroup_ids = [];
      Object.values(value.goods_group).forEach( item => {
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
              store_quantity: value.stock[`${subItem.id}`].store_quantity || 0
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
          warehouses.forEach( subItem => {
            item.stocks.push({
              warehouse_id: value.stock[`${subItem.id}_${item.attributes[0].attribute_id}`].warehouse_id,
              store_quantity: value.stock[`${subItem.id}_${item.attributes[0].attribute_id}`].store_quantity || 0
            })
          })
        })
      }else if(value.color_select.length !== 0 && value.size_select !== 0) {
        state.serverData.dimension = [1,2]
        value.color_select.forEach( colorId => {
          value.size_select.forEach( sizeId => {
            state.serverData.skus.push({
              barcode: itemBarcodeLevel === 1 ? value.barcode[`${colorId}_${sizeId}`].barcode  : '',
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
          warehouses.forEach( subItem => {
            item.stocks.push({
              warehouse_id: value.stock[`${subItem.id}_${item.attributes[0].attribute_id}_${item.attributes[1].attribute_id}`].warehouse_id,
              store_quantity: value.stock[`${subItem.id}_${item.attributes[0].attribute_id}_${item.attributes[1].attribute_id}`].store_quantity || 0
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
