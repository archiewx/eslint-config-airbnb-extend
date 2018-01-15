import * as goodsService from '../services/goods'
import {message} from 'antd'

export default  {

  namespace: 'goodsCreate',

  state: {
    serverData: {}
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {

  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setServerData (state,{payload:{value,selectUnits,warehouses,itemBarcodeLevel,itemImageLevel}}) {
      console.log(value)
      state.serverData.item_ref = value.item_ref;
      state.serverData.purchase_price = value.purchase_price || null;
      state.serverData.units = selectUnits.map( item => {
        return {
          id: item.id,
          number: item.number
        }
      })
      state.serverData.name = value.name || null;
      state.serverData.desc = value.desc || null;
      state.serverData.prices = Object.values(value.prices_table)
      state.serverData.itemgroup_ids = [];
      Object.values(value.goods_group || {}).forEach( item => {
        state.serverData.itemgroup_ids = state.serverData.itemgroup_ids.concat(...item)
      })
      state.serverData.skus = [];
      if(value.color_select.length === 0 && value.size_select.length === 0 ) {
        state.serverData.dimension = []
        warehouses.forEach( item => {
          state.serverData.skus.push({
            barcode: itemBarcodeLevel === 1 ? value.barcode.barcode : null ,
            attributes: [],
            images: [],
            stocks: [{
              warehouse_id: value.stock[`${item.id}`].warehouse_id,
              store_quantity : value.stock[`${item.id}`].store_quantity
            }]
          })
        })
      }else if(value.color_select.length !== 0 && value.size_select.length === 0) {
        state.serverData.dimension = [1]
        warehouses.forEach( item => {
          value.color_select.forEach( colorId => {
            state.serverData.skus.push({
              barcode: itemBarcodeLevel === 1 ? value.barcode[`${colorId}`].barcode : null,
              attributes: [{
                attributetype_id: 1,
                attribute_id: colorId
              }],
              images: [],
              stocks: [{
                warehouse_id: value.stock[`${item.id}_${colorId}`].warehouse_id,
                store_quantity: value.stock[`${item.id}_${colorId}`].store_quantity,
              }]
            })
          })
        })
      }else if(value.color_select.length !== 0 && value.size_select !== 0) {
        state.serverData.dimension = [1,2]
        warehouses.forEach( item => {
          value.color_select.forEach( colorId => {
            value.size_select.forEach( sizeId => {
              state.serverData.skus.push({
                barcode: itemBarcodeLevel === 1 ? value.barcode[`${colorId}_${sizeId}`].barcode : null,
                attributes: [{
                  attributetype_id: 1,
                  attribute_id: colorId
                },{
                  attributetype_id: 2,
                  attribute_id: sizeId
                }],
                images: [],
                stocks: [{
                  warehouse_id: value.stock[`${item.id}_${colorId}_${sizeId}`].warehouse_id,
                  store_quantity: value.stock[`${item.id}_${colorId}_${sizeId}`].store_quantity
                }]
              })
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
