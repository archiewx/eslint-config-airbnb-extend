import * as goodsService from '../services/goods'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router';

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
    *getSingle({payload},{call,put,select}) {  
      const {usePricelelvel,priceModel} = yield select(({configSetting}) => (configSetting))
      const [data1,data2,data3,data4,data5,data6] = yield [call(goodsService.getSingle,payload),call(goodsService.getSingleSales,payload),call(goodsService.getSinglePurchases,payload),call(goodsService.getSingleCustomers,payload),call(goodsService.getSingleSuppliers,payload),call(goodsService.getSingleStocks,payload)]
      yield put({type:'setShowData',payload:{
        value: data1.result.data,
        usePricelelvel,
        priceModel,
      }})
      yield put({type:'setState',payload:{
        singleGoodsSales:data2.result.data.list,
        singleGoodsPurchases:data3.result.data.list,
        singleGoodsCustomers:data4.result.data.list,
        singleGoodsSuppliers:data5.result.data.list,
        singleGoodsStocks:data6.result.data.list,
        currentId:payload
      }})
    },

    *deleteSingleGoods({payload},{call,put}) {
      const data = yield call(goodsService.deleteSingleGoods,payload)
      yield put(routerRedux.push('/goods-list'));
    },

    *changeGoodsStatus({payload},{call,put}) {
      const data = yield call(goodsService.changeGoodsStatus,payload)
      yield put({type:'getSingleMessage',payload:payload})
    },

    *getSingleMessage({payload},{call,put}) {

      const data = yield call(goodsService.getSingle,payload)
      yield put({type:'setShowData',payload:{
        value:data.result.data
      }})
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setShowData (state,{payload:{value,usePricelelvel,priceModel}}) {
      console.log(value)
      state.singleGoodsDetail.item_ref = value.item_ref;
      state.singleGoodsDetail.not_sale = value.not_sale;
      state.singleGoodsDetail.purchase_price = value.purchase_price;
      state.singleGoodsDetail.standard_price = value.standard_price;
      state.singleGoodsDetail.name = value.name;
      state.singleGoodsDetail.desc = value.desc;

      state.singleGoodsDetail.units = value.units.data.map( item => (`${item.name} x ( ${item.number} )`)).join('、')
      let colors = [] , sizes = [];
      state.singleGoodsDetail.images = [];
      value.skus.data.forEach( item => {
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
        item.skuimages.data.forEach( subItem => {
          if(!state.singleGoodsDetail.images.some( imageItem => imageItem.name  == subItem.name)) {
            state.singleGoodsDetail.images.push({
              name: subItem.name,
              url: subItem.url,
              id: subItem.id
            })
          }
        })
      })
      state.singleGoodsDetail.colors = colors.map( item => item.name).join('、')
      state.singleGoodsDetail.sizes = sizes.map( item => item.name).join('、')
      state.singleGoodsDetail.goodsGroup = value.itemgroups.data.map( item => item.name ).join('、')

      return {...state}
    }

  },

};
