import * as goodsService from '../services/goods'
import * as customerGroupService from '../services/customerGroup'
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
    filterSaleServerData:{},
    filterPurchaseServerData:{},
    filterCustomerServerData:{},
    filterSupplierServerData:{},
    filterStockServerData:{},
    singleCustomerMode:[],
    currentId: '',
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
    *getSingle({payload},{call,put,select,all}) {  
      const {usePricelelvel,priceModel} = yield select(({configSetting}) => (configSetting))
      const [data1,data2,data3,data4,data5,data6,data7] = yield all([
        call(goodsService.getSingle,payload),
        call(goodsService.getSingleSales,payload),
        call(goodsService.getSinglePurchases,payload),
        call(goodsService.getSingleCustomers,payload),
        call(goodsService.getSingleSuppliers,payload),
        call(goodsService.getSingleStocks,payload),
        call(customerGroupService.getListGroup),
      ])
      yield put({type:'setShowData',payload:{
        value: data1.result.data,
        usePricelelvel,
        priceModel,
      }})
      yield put({type:'setShowSaleList',payload:data2.result.data.list})
      yield put({type:'setShowPurchaseList',payload:data3.result.data.list})
      yield put({type:'setShowStockList',payload:data6.result.data.list})
      yield put({type:'setShowCustomerList',payload:data4.result.data})
      yield put({type:'setState',payload:{
        singleGoodsSuppliers:data5.result.data.list,
        currentId:payload
      }})
      yield put({type:'setShowCustomerMode',payload:data7.result.data})
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
    },

    *getSingleSales({payload},{call,put}) {
      const data = yield call(goodsService.getSingleSales,payload) 
      yield put({type:'setShowSaleList',payload:data.result.data.list})
    },

    *getSinglePurchases({payload},{call,put}) {
      const data = yield call(goodsService.getSinglePurchases,payload) 
      yield put({type:'setShowPurchaseList',payload:data.result.data.list})
    },

    *getSingleCustomers({payload},{call,put}) {
      const data = yield call(goodsService.getSingleCustomers,payload) 
      yield put({type:'setShowCustomerList',payload:data.result.data})
    },

    *getSingleSuppliers({payload},{call,put}) {
      const data = yield call(goodsService.getSingleSuppliers,payload) 
      yield put({type:'setState',payload:{
        singleGoodsSuppliers: data.result.data.list
      }})
    },

    *getSingleStocks({payload},{call,put}) {
      const data = yield call(goodsService.getSingleStocks,payload) 
      yield put({type:'setShowStockList',payload:data.result.data.list})
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setShowData (state,{payload:{value,usePricelelvel,priceModel}}) {
      console.log(value)
      state.singleGoodsDetail = {}
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
    },

    setShowCustomerMode(state,{payload}) {
      state.singleCustomerMode.push({
        name:'不分组',
        mode:'customer'
      })
      state.singleCustomerMode.push({
        name:'客户等级',
        mode:'vip'
      })
      payload.forEach( item => {
        state.singleCustomerMode.push({
          name:item.name,
          mode:`customergroup_${item.id}`
        })
      })
      return {...state}
    },  

    setFilterSaleServerData (state,{payload}) {
      let current = {}
      for(let key in payload) {
        if(key.indexOf('sale_') == 0) {
          if(payload[key]) {
            let name = key.slice(5,key.length)
            if(name == 'datePick') {
              current['data_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      state.filterSaleServerData = current
      return {...state}
    },

    setFilterPurchaseServerData (state,{payload}) {
      let current = {}
      for(let key in payload) {
        if(key.indexOf('purchase_') == 0) {
          if(payload[key]) {
            let name = key.slice(9,key.length)
            if(name == 'datePick') {
              current['data_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      state.filterPurchaseServerData = current
      return {...state}
    },

    setFilterCustomerServerData (state,{payload}) {
      let current = {}
      for(let key in payload) {
        if(key.indexOf('customer_') == 0) {
          if(payload[key]) {
            let name = key.slice(9,key.length)
            if(name == 'datePick') {
              current['data_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      state.filterCustomerServerData = current
      return {...state}
    },

    setFilterSupplierServerData (state,{payload}) {
      let current = {}
      for(let key in payload) {
        if(key.indexOf('supplier_') == 0) {
          if(payload[key]) {
            let name = key.slice(9,key.length)
            if(name == 'datePick') {
              current['data_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      state.filterSupplierServerData = current
      return {...state}
    },

    setFilterStockServerData (state,{payload}) {
      let current = {}
      for(let key in payload) {
        if(key.indexOf('stock_') == 0) {
          if(payload[key]) {
            let name = key.slice(9,key.length)
            if(name == 'datePick') {
              current['data_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      state.filterStockServerData = current
      return {...state}
    },


    setShowCustomerList(state,{payload}) {
      let current = []
      current.push(payload.guest)
      state.singleGoodsCustomers = [].concat(current,payload.list)
      return {...state}
    },

    setShowSaleList(state,{payload}) {
      let colorCurrent = [];
      let sizeCurrent = {};
      let flagId = '';
      payload.forEach( item => {
        if(!colorCurrent.some( subItem => subItem.id == item.skuattributes[0].id)) {
          colorCurrent.push({
            id: item.skuattributes[0].id,
            name: item.skuattributes[0].name,
            childrens: [],
            sales_quantity: '',
            sales_amount: '',
            profit: '',
            stock_quantity: '',
          })
        }
        if(flagId != item.skuattributes[0].id) {
          flagId = item.skuattributes[0].id;
          sizeCurrent[`${item.skuattributes[0].id}`] = [];
          sizeCurrent[`${item.skuattributes[0].id}`].push({
            id: item.skuattributes[1].id,
            name: item.skuattributes[1].name,
            sales_quantity: item.sales_quantity,
            sales_amount: item.sales_amount,
            profit: item.profit,
            stock_quantity: item.stock_quantity
          })
        }else {
          sizeCurrent[`${flagId}`].push({
            id: item.skuattributes[1].id,
            name: item.skuattributes[1].name,
            sales_quantity: item.sales_quantity,
            sales_amount: item.sales_amount,
            profit: item.profit,
            stock_quantity: item.stock_quantity
          })
        }
      })
      for(let key in sizeCurrent) {
        colorCurrent[(colorCurrent.findIndex( item => item.id == key))].childrens = sizeCurrent[key]
      }
      colorCurrent.forEach( item => {
        let sales_quantity = 0 ,sales_amount = 0,profit = 0,stock_quantity = 0;
        item.childrens.forEach( subItem => {
          sales_quantity += Number(subItem.sales_quantity );
          sales_amount += Number(subItem.sales_amount );
          profit += Number(subItem.profit );
          stock_quantity += Number(subItem.stock_quantity );
        })
        item.sales_quantity = sales_quantity;
        item.sales_amount = (sales_amount).toFixed(2);
        item.profit = (profit).toFixed(2);
        item.stock_quantity = stock_quantity;
      })
      state.singleGoodsSales = colorCurrent

      return {...state}
    },

    setShowPurchaseList(state,{payload}) {
      let colorCurrent = [];
      let sizeCurrent = {};
      let flagId = '';
      payload.forEach( item => {
        if(!colorCurrent.some( subItem => subItem.id == item.skuattributes[0].id)) {
          colorCurrent.push({
            id: item.skuattributes[0].id,
            name: item.skuattributes[0].name,
            childrens: [],
            purchase_quantity: '',
            purchase_amount: '',
            stock_quantity: '',
          })
        }
        if(flagId != item.skuattributes[0].id) {
          flagId = item.skuattributes[0].id;
          sizeCurrent[`${item.skuattributes[0].id}`] = [];
          sizeCurrent[`${item.skuattributes[0].id}`].push({
            id: item.skuattributes[1].id,
            name: item.skuattributes[1].name,
            purchase_quantity: item.purchase_quantity,
            purchase_amount: item.purchase_amount,
            stock_quantity: item.stock_quantity
          })
        }else {
          sizeCurrent[`${flagId}`].push({
            id: item.skuattributes[1].id,
            name: item.skuattributes[1].name,
            purchase_quantity: item.purchase_quantity,
            purchase_amount: item.purchase_amount,
            stock_quantity: item.stock_quantity
          })
        }
      })
      for(let key in sizeCurrent) {
        colorCurrent[(colorCurrent.findIndex( item => item.id == key))].childrens = sizeCurrent[key]
      }
      colorCurrent.forEach( item => {
        let purchase_quantity = 0 ,purchase_amount = 0,stock_quantity = 0;
        item.childrens.forEach( subItem => {
          purchase_quantity += Number(subItem.purchase_quantity );
          purchase_amount += Number(subItem.purchase_amount );
          stock_quantity += Number(subItem.stock_quantity );
        })
        item.purchase_quantity = purchase_quantity;
        item.purchase_amount = (purchase_amount).toFixed(2);
        item.stock_quantity = stock_quantity;
      })
      state.singleGoodsPurchases = colorCurrent
      return {...state}
    },

    setShowStockList(state,{payload}) {
      let colorCurrent = [];
      let sizeCurrent = {};
      let flagId = '';
      payload.forEach( item => {
        if(!colorCurrent.some( subItem => subItem.id == item.skuattributes[0].id)) {
          colorCurrent.push({
            id: item.skuattributes[0].id,
            name: item.skuattributes[0].name,
            childrens: [],
            sales_quantity: '',
            purchase_quantity: '',
            stock_quantity: '',
          })
        }
        if(flagId != item.skuattributes[0].id) {
          flagId = item.skuattributes[0].id;
          sizeCurrent[`${item.skuattributes[0].id}`] = [];
          sizeCurrent[`${item.skuattributes[0].id}`].push({
            id: item.skuattributes[1].id,
            name: item.skuattributes[1].name,
            sales_quantity: item.sales_quantity,
            purchase_quantity: item.purchase_quantity,
            stock_quantity: item.stock_quantity
          })
        }else {
          sizeCurrent[`${flagId}`].push({
            id: item.skuattributes[1].id,
            name: item.skuattributes[1].name,
            sales_quantity: item.sales_quantity,
            purchase_quantity: item.purchase_quantity,
            stock_quantity: item.stock_quantity
          })
        }
      })
      for(let key in sizeCurrent) {
        colorCurrent[(colorCurrent.findIndex( item => item.id == key))].childrens = sizeCurrent[key]
      }
      colorCurrent.forEach( item => {
        let sales_quantity = 0 ,purchase_quantity = 0,stock_quantity = 0;
        item.childrens.forEach( subItem => {
          sales_quantity += Number(subItem.sales_quantity );
          purchase_quantity += Number(subItem.purchase_quantity );
          stock_quantity += Number(subItem.stock_quantity );
        })
        item.sales_quantity = sales_quantity;
        item.purchase_quantity = (purchase_quantity).toFixed(2);
        item.stock_quantity = stock_quantity;
      })
      state.singleGoodsStocks = colorCurrent
      return {...state}
    }

  },

};




















