import * as goodsService from '../services/goods'
import pathToRegexp from 'path-to-regexp'

export default  {

  namespace: 'goodsDetail',

  state: {
    singleGoodsDetail:{},
    singleGoodsSales:[],
    singleGoodsPurchases:[],
    singleGoodsCustomers:[],
    singleGoodsSuppliers:[],
    singleGoodsStocks:[],
    currentId: ''
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/goods-detail/:id').exec(location.hash.slice(1,location.hash.length))
        if(match) {
          dispatch({type:'getSingle',payload:{id:match[1]}})
        }
      })
    },
  },

  effects: {
    *getSingle({payload},{call,put}) {  
      const [data1,data2,data3,data4,data5,data6] = yield [call(goodsService.getSingle,payload),call(goodsService.getSingleSales,payload),call(goodsService.getSinglePurchases,payload),call(goodsService.getSingleCustomers,payload),call(goodsService.getSingleSuppliers,payload),call(goodsService.getSingleStocks,payload)]
      yield put({type:'setShowData',payload:data1.result.data})
      yield put({type:'setState',payload:{
        singleGoodsSales:data2.result.data.list,
        singleGoodsPurchases:data3.result.data.list,
        singleGoodsCustomers:data4.result.data.list,
        singleGoodsSuppliers:data5.result.data.list,
        singleGoodsStocks:data6.result.data.list,
        currentId:payload
      }})
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setShowData (state,{payload}) {
      state.singleGoodsDetail.item_ref = payload.item_ref;
      state.singleGoodsDetail.not_sale = payload.not_sale;
      state.singleGoodsDetail.purchase_price = payload.purchase_price;
      state.singleGoodsDetail.standard_price = payload.standard_price;
      state.singleGoodsDetail.name = payload.name;
      state.singleGoodsDetail.desc = payload.desc;
      state.singleGoodsDetail.units = payload.units.data.map( item => (`${item.name} x ( ${item.number} )`)).join('、')
      let colors = [] , sizes = [];
      payload.skus.data.forEach( item => {
        item.skuattributes.data.forEach( subItem => {
          if(subItem.skuattributetype_id === '1') {
            if(!colors.some( colorItem => colorItem.id === subItem.id)) {
              colors.push({
                name:subItem.name,
                id:subItem.id,
              })
            }
          }
          if(subItem.skuattributetype_id === '2') {
            if(!sizes.some( sizeItem => sizeItem.id === subItem.id)) {
              sizes.push({
                name:subItem.name,
                id:subItem.id,
              })
            }
          }
        })
      })
      console.log(colors)
      state.singleGoodsDetail.colors = colors.map( item => item.name).join('、')
      state.singleGoodsDetail.sizes = sizes.map( item => item.name).join('、')
      state.singleGoodsDetail.goodsGroup = payload.itemgroups.data.map( item => item.name ).join('、')
      return {...state}
    }

  },

};
