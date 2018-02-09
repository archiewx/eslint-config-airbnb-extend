import * as goodsService from '../services/goods'
import * as pictureService from '../services/picture'
import {imageApiBase} from '../common/index'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'goodsCreateOrEdit',

  state: {
    serverData: {},
    showData: {},
    imageFile:[]
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
      yield call(goodsService.createSingle,payload.serverData)
      for(let i=0;i<payload.imageFile.length;i++) {
        yield call(pictureService.upload,payload.imageFile[i])
      }
    },

    *getSingleGoods({payload},{call,put,select}) {
      const data = yield call(goodsService.getSingle,payload)
      const {usePricelelvel,priceModel,itemBarcodeLevel,itemImageLevel} = yield select(({configSetting}) => configSetting)
      yield put({type:'setShowData',payload:{
        value:data.result.data,
        itemimage:data.result.itemimage_names,
        usePricelelvel,
        priceModel,
        itemBarcodeLevel,
        itemImageLevel,
      }})
    },

    *editSingleGoods({payload},{call,put}) {
      yield call(goodsService.editSingle,{serverData:payload.serverData,id:payload.id})
      for(let i=0;i<payload.imageFile.length;i++) {
        yield call(pictureService.upload,payload.imageFile[i])
      }
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

    setShowData (state,{payload:{value,itemimage,usePricelelvel,priceModel,itemBarcodeLevel,itemImageLevel}}) {
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
            if(item.pricelevel_id && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {
              state.showData.prices[`${item.pricelevel_id}`] = {
                price:item.price
              }
            }else if(item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {}
            else {
              flag = true;    
            }
          })
        }else if(priceModel == 'shop') {
          priceMatrix.forEach( item => {
            if(item.pricelevel_id && item.shop_id && item.unit_id == null && item.quantityrange_id == null) {
              state.showData.prices[`${item.shop_id}_${item.pricelevel_id}`] = {
                price:item.price
              }
            }else if(item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {}
            else {
              flag = true;    
            }
          })
        }else if(priceModel == 'unit') {
          priceMatrix.forEach( item => {
            if(item.pricelevel_id && item.shop_id == null && item.unit_id && item.quantityrange_id == null) {
              stata.showData.prices[`${item.unit_id}_${item.pricelevel_id}`] = {
                price:item.price
              }
            }else if(item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {}
            else {
              flag = true;    
            }
          })
        }else if(priceModel == 'quantityrange') {
          priceMatrix.forEach( item => {
            if(item.pricelevel_id && item.shop_id == null && item.unit_id == null && item.quantityrange_id) {
              state.showData.prices[`${item.quantityrange_id}_${item.pricelevel_id}`] = {
                price:item.price
              }
            }else if(item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {}
            else {
              flag = true;    
            }
          })
        }
      }else {
        if(priceModel == 'shop') {
          priceMatrix.forEach( item => {
            if(item.pricelevel_id == null && item.shop_id  && item.unit_id == null && item.quantityrange_id == null) {
              state.showData.prices[`${item.shop_id}`] = {
                price: item.price
              } 
            }else if(item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {}
            else {
              flag = true;    
            }
          })
        }else if(priceModel == 'unit') {
          priceMatrix.forEach( item => {
            if(item.pricelevel_id == null && item.shop_id == null && item.unit_id && item.quantityrange_id == null) {
              state.showData.prices[`${item.unit_id}`] = {
                price: item.price
              }
            }else if(item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {}
            else {
              flag = true;    
            }
          })
        }else if(priceModel == 'quantityrange') {
          priceMatrix.forEach( item => {
            if(item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id ) {
              state.showData.prices[`${item.quantityrange_id}`] = {
                price: item.price
              }
            }else if(item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {}
            else {
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
      if(priceModel == 'quantityrange') {
        state.showData.selectQuantityStep = value.quantityrangegroup.data.quantityranges.data.map( (item,index) =>  {
          let name;
          if(item.max == -1) {
            name = `${item.min} ~`
          }else {
            name = `${item.min} ~ ${item.max - 1}`
          }
          return {
            id: item.id,
            name: name
          }
        })
      }
      state.showData.selectUnits = value.units.data.map( item => {
        return {
          id: item.id,
          name: `${item.name} x ( ${item.number} )`,
          number: item.number
        }
      })
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
      state.showData.selectColors = [];
      state.showData.selectSizes = [];
      value.skus.data.forEach( item => {
        item.skuattributes.data.forEach( subItem => {
          if(subItem.skuattributetype_id == '1') {
            if(!state.showData.colors.some( n => n == subItem.id)) {
              state.showData.colors.push((subItem.id).toString())
              state.showData.selectColors.push({
                id:subItem.id,
                name:subItem.name
              })
            }
          }else if(subItem.skuattributetype_id == '2') {
            if(!state.showData.sizes.some( n => n == subItem.id)) {
              state.showData.sizes.push((subItem.id).toString())
              state.showData.selectSizes.push({
                id:subItem.id,
                name:subItem.name
              })
            }
          }
        })
      }) 
      state.showData.imageFile = {};
      state.showData.stocks = {};
      state.showData.barcodes = {}
      state.showData.barcodeId = {}
      if(state.showData.colors.length == 0) {
        value.skus.data.forEach( item => {
          item.skustocks.data.forEach( subItem => {
            state.showData.stocks[`${subItem.warehouse_id}`] = {
              store_quantity : subItem.store_quantity
            }
          })
          state.showData.barcodes = {
            barcode: itemBarcodeLevel == 1 ? item.barcode : '',
          }
          state.showData.barcodeId = {
            id: item.id
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
              barcode: itemBarcodeLevel == 1 ? item.barcode : '',
            }
            state.showData.barcodeId[`${colorId}`] = {
              id: item.id
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
              barcode: itemBarcodeLevel == 1 ? item.barcode : '',
            }
            state.showData.barcodeId[`${colorId}_${sizeId}`] = {
              id: item.id
            }
          })
        }
      }
      itemBarcodeLevel == 0 ? state.showData.barcodes.barcode = value.barcode : ''
      if(itemImageLevel == 'item') {
        state.showData.imageFile = [];
        itemimage.forEach( item => {
          state.showData.imageFile.push({
            uid: Number('-' + window.crypto.getRandomValues(new Uint32Array(1))[0].toString()),
            url: `${imageApiBase}/${item}`,
            name: item,
            status: 'done'
          })
        })
      }
      console.log(state.showData)
      return {...state}
    },


    setServerData (state,{payload:{value,selectColors,selectUnits,selectQuantityStep,warehouses,priceModel,itemBarcodeLevel,itemImageLevel}}) {
      console.log(value)
      state.serverData = {}
      state.serverData.item_ref = value.item_ref;
      state.serverData.standard_price = value.standard_price;
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
      let picture = {}
      if(itemImageLevel == 'item') {
        picture.fileName = [];
        value.picture.fileList.forEach( item => {
          delete item.url;
          if(item.type) {
            let fileName = (window.crypto.getRandomValues(new Uint32Array(1))[0]).toString() + (new Date()).getTime() + '.' + (item.type).slice(6,(item.type).length)
            picture.fileName.push(fileName)
            state.imageFile.push({
              image_name: fileName,
              image_file: item
            })
          }else {
            picture.fileName.push(item.name)
          }
        })
      }else {
        for(let key in value.picture) {
          if(!!value.picture[key].fileList.length) {
            picture[key].fileName = [];
            value.picture[key].fileList.forEach( item => {
              delete item.url;
              let fileName = (window.crypto.getRandomValues(new Uint32Array(1))[0]).toString() + (new Date()).getTime() + '.' + (item.type).slice(6,(item.type).length)
              picture[key].fileName.push( fileName)
              state.imageFile.push({
                image_name: fileName,
                image_file: item
              })
            })
          }
        }
      }
      state.serverData.skus = [];
      if(value.color_select.length === 0 && value.size_select.length === 0 ) {
        state.serverData.dimension = []
        if(state.showData.barcodeId) {
          state.serverData.skus.push({
            id: state.showData.barcodeId.id,
            barcode: itemBarcodeLevel === 1 ? value.barcode.barcode : '' ,
            attributes: [],
            images: [],
            stocks: []
          })
        }else {
          state.serverData.skus.push({
            barcode: itemBarcodeLevel === 1 ? value.barcode.barcode : '' ,
            attributes: [],
            images: [],
            stocks: []
          })
        }
        state.serverData.skus.forEach( item => {
          warehouses.forEach( subItem => {
            item.stocks.push({
              warehouse_id: value.stock[`${subItem.id}`].warehouse_id,
              store_quantity: value.stock[`${subItem.id}`].store_quantity || 0
            })
          })
        })
      }else if(value.color_select.length !== 0 && value.size_select.length === 0) {
        // let skuStock = value.stocks;
        // warehouses.forEach( item => {
        //   selectColors.forEach( colorItem => {
                          
        //   })
        // })
        state.serverData.dimension = [1]
        value.color_select.forEach( colorId => {
          if(state.showData.barcodeId && Object.keys(state.showData.barcodeId).some(n => n == colorId)) {
            state.serverData.skus.push({
              id: state.showData.barcodeId[`${colorId}`].id,
              barcode: itemBarcodeLevel === 1 ? value.barcode[`${colorId}`].barcode : '',
              attributes: [{
                attributetype_id: 1,
                attribute_id: colorId
              }],
              images: [],
              stocks: []
            })
          }else {
            state.serverData.skus.push({
              barcode: itemBarcodeLevel === 1 ? value.barcode[`${colorId}`].barcode : '',
              attributes: [{
                attributetype_id: 1,
                attribute_id: colorId
              }],
              images: [],
              stocks: []
            })
          }
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
            if(state.showData.barcodeId && Object.keys(state.showData.barcodeId).some( n => n == `${colorId}_${sizeId}`)) {
              state.serverData.skus.push({
                id:state.showData.barcodeId[`${colorId}_${sizeId}`].id,
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
            }else {
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
            }
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
      itemImageLevel === 'item' ? state.serverData.itemimages = picture.fileName : null
      itemBarcodeLevel === 0 ? state.serverData.barcode = value.barcode.barcode : null
      console.log(state.serverData)
      return {...state}
    }

  },

};
