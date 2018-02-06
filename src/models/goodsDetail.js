import * as goodsService from '../services/goods'
import * as customerGroupService from '../services/customerGroup'
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
    },
  },

  effects: {
    *getSingle({payload},{call,put,select,all}) {  
      const [data1,data2,data3,data4,data5,data6,data7] = yield all([
        call(goodsService.getSingle,payload),
        call(goodsService.getSingleSales,payload),
        call(goodsService.getSinglePurchases,payload),
        call(goodsService.getSingleCustomers,payload),
        call(goodsService.getSingleSuppliers,payload),
        call(goodsService.getSingleStocks,payload),
        call(customerGroupService.getListGroup),
      ])
      const {usePricelelvel,priceModel} = yield select(({configSetting}) => (configSetting))
      yield put({type:'setsingleGoodsDetail',payload:{
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
      yield put({type:'setsingleGoodsDetail',payload:{
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

    setsingleGoodsDetail (state,{payload:{value,usePricelelvel,priceModel}}) {
      console.log(value)
      state.singleGoodsDetail = {}
      state.singleGoodsDetail.item_ref = value.item_ref;
      state.singleGoodsDetail.not_sale = value.not_sale;
      state.singleGoodsDetail.purchase_price = value.purchase_price;
      state.singleGoodsDetail.standard_price = value.standard_price;
      state.singleGoodsDetail.name = value.name;
      state.singleGoodsDetail.desc = value.desc;

      let priceMatrix = [...value.itemprices.data];
      state.singleGoodsDetail.prices = {};
      let flag = false;
      if(usePricelelvel == 'yes') {
        if(priceModel == '') {
          priceMatrix.forEach( item => {
            if(item.pricelevel_id && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {
              state.singleGoodsDetail.prices[`${item.pricelevel_id}`] = {
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
              state.singleGoodsDetail.prices[`${item.shop_id}_${item.pricelevel_id}`] = {
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
              stata.singleGoodsDetail.prices[`${item.unit_id}_${item.pricelevel_id}`] = {
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
              state.singleGoodsDetail.prices[`${item.quantityrange_id}_${item.pricelevel_id}`] = {
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
              state.singleGoodsDetail.prices[`${item.shop_id}`] = {
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
              state.singleGoodsDetail.prices[`${item.unit_id}`] = {
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
              state.singleGoodsDetail.prices[`${item.quantityrange_id}`] = {
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
        state.singleGoodsDetail.hidePriceTable = false;
      }else {
        state.singleGoodsDetail.hidePriceTable = true;
        state.singleGoodsDetail.priceGrades = [];
        state.singleGoodsDetail.selectShops = [];
        state.singleGoodsDetail.selectUnits = [];
        state.singleGoodsDetail.selectQuantityStep = [];
        value.itemprices.data.forEach( item => {
          if(item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {}
          else {
            if(!state.singleGoodsDetail.priceGrades.some( n => n.id == item.pricelevel.data.id)) {
              state.singleGoodsDetail.priceGrades.push({
                id:item.pricelevel.data.id,
                name:item.pricelevel.data.name
              })
            }
          }
        })
        if(priceModel == 'quantityrange') {
          state.singleGoodsDetail.selectQuantityStep = value.quantityrangegroup.data.quantityranges.data.map( (item,index) =>  {
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
        }else if(priceModel == 'unit') {
          state.singleGoodsDetail.selectUnits = value.units.data.map( item => {
            return {
              id: item.id,
              name: `${item.name} x ( ${item.number} )`,
              number: item.number
            }
          })
        }else if(priceModel == 'shop') {
          value.itemprices.data.forEach( item => {
            if(item.pricelevel_id == null && item.shop_id == null && item.unit_id == null && item.quantityrange_id == null) {}
            else {
              if(!state.singleGoodsDetail.selectShops.some( n => n.id == item.shop.data.id)) {
                state.singleGoodsDetail.selectShops.push({
                  id:item.shop.data.id,
                  name:item.shop.data.name
                })
              }
            }
          })
        }
      }
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
        item.skuimages && item.skuimages.data.forEach( subItem => {
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
      console.log(state.singleGoodsDetail)
      return {...state}
    },

    setShowCustomerMode(state,{payload}) {
      state.singleCustomerMode = [];
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
              current['date_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      for(let key in current) {
        if(Array.isArray(current[key]) && !current[key].length) {
          delete current[key]
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
              current['date_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      for(let key in current) {
        if(Array.isArray(current[key]) && !current[key].length) {
          delete current[key]
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
              current['date_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      for(let key in current) {
        if(Array.isArray(current[key]) && !current[key].length) {
          delete current[key]
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
              current['date_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      for(let key in current) {
        if(Array.isArray(current[key]) && !current[key].length) {
          delete current[key]
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
              current['date_type'] = 'custom'
              current['sday'] = payload[key][0]
              current['eday'] = payload[key][1]
            }else {
              current[`${name}_in`] = payload[key]
            }
          }
        }
      }
      for(let key in current) {
        if(Array.isArray(current[key]) && !current[key].length) {
          delete current[key]
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
      state.singleGoodsSales = []
      if(payload.length === 0) {
        state.singleGoodsSales = payload
      }else {
        payload.forEach( item => {
          if(item.skuattributes.length === 0) {
            state.singleGoodsSales.push({
              id: item.id,
              name:'',
              sales_quantity:Number(item.sales_quantity),
              sales_amount:Number(item.sales_amount).toFixed(2),
              profit:Number(item.profit).toFixed(2),
              stock_quantity:Number(item.stock_quantity)
            })
          }else if(item.skuattributes.length === 1) {
            state.singleGoodsSales.push({
              id:item.id,
              name:item.skuattributes[0].name,
              sales_quantity:Number(item.sales_quantity),
              sales_amount:Number(item.sales_amount).toFixed(2),
              profit:Number(item.profit).toFixed(2),
              stock_quantity:Number(item.stock_quantity)
            })
          }else if(item.skuattributes.length === 2) {
            if(!state.singleGoodsSales.some( subItem => subItem.colorId == item.skuattributes[0].id)) {
              state.singleGoodsSales.push({
                id:item.id,
                name:item.skuattributes[0].name,
                sales_quantity:Number(item.sales_quantity),
                sales_amount:Number(item.sales_amount).toFixed(2),
                profit:Number(item.profit).toFixed(2),
                stock_quantity:Number(item.stock_quantity),
                colorId:item.skuattributes[0].id,
                childrens:[{
                  id:item.skuattributes[1].id,
                  name:item.skuattributes[1].name,
                  sales_quantity:Number(item.sales_quantity),
                  sales_amount:Number(item.sales_amount).toFixed(2),
                  profit:Number(item.profit).toFixed(2),
                  stock_quantity:Number(item.stock_quantity),
                }],
              })
            }else {
              let current = state.singleGoodsSales[state.singleGoodsSales.findIndex(subItem => subItem.colorId == item.skuattributes[0].id)]
              current = {
                id:item.id,
                name:item.skuattributes[0].name,
                sales_quantity:Number(current.sales_quantity + Number(item.sales_quantity)),
                sales_amount:Number(Number(current.sales_amount) + Number(item.sales_amount)).toFixed(2),
                profit:Number(Number(current.profit) + Number(item.profit)).toFixed(2),
                stock_quantity:Number(current.stock_quantity + Number(item.stock_quantity)),
                colorId:item.skuattributes[0].id,
                childrens:current.childrens
              }
              current.childrens.push({
                id:item.skuattributes[1].id,
                name:item.skuattributes[1].name,
                sales_quantity:Number(item.sales_quantity),
                sales_amount:Number(item.sales_amount).toFixed(2),
                profit:Number(item.profit).toFixed(2),
                stock_quantity:Number(item.stock_quantity),
              })
              state.singleGoodsSales[state.singleGoodsSales.findIndex(subItem => subItem.colorId == item.skuattributes[0].id)] = {...current}
            }
          }
        })
      }
      return {...state}
    },

    setShowPurchaseList(state,{payload}) {
      state.singleGoodsPurchases = []
      if(payload.length === 0) {
        state.singleGoodsPurchases = payload
      }else {
        payload.forEach( item => {
          if(item.skuattributes.length === 0) {
            state.singleGoodsPurchases.push({
              id: item.id,
              name:'',
              purchase_quantity:Number(item.purchase_quantity),
              purchase_amount:Number(item.purchase_amount).toFixed(2),
              stock_quantity:Number(item.stock_quantity)
            })
          }else if(item.skuattributes.length === 1) {
            state.singleGoodsPurchases.push({
              id:item.id,
              name:item.skuattributes[0].name,
              purchase_quantity:Number(item.purchase_quantity),
              purchase_amount:Number(item.purchase_amount).toFixed(2),
              stock_quantity:Number(item.stock_quantity)
            })
          }else if(item.skuattributes.length === 2) {
            if(!state.singleGoodsPurchases.some( subItem => subItem.colorId == item.skuattributes[0].id)) {
              state.singleGoodsPurchases.push({
                id:item.id,
                name:item.skuattributes[0].name,
                purchase_quantity:Number(item.purchase_quantity),
                purchase_amount:Number(item.purchase_amount).toFixed(2),
                stock_quantity:Number(item.stock_quantity),
                colorId:item.skuattributes[0].id,
                childrens:[{
                  id:item.skuattributes[1].id,
                  name:item.skuattributes[1].name,
                  purchase_quantity:Number(item.purchase_quantity),
                  purchase_amount:Number(item.purchase_amount).toFixed(2),
                  stock_quantity:Number(item.stock_quantity),
                }],
              })
            }else {
              let current = state.singleGoodsPurchases[state.singleGoodsPurchases.findIndex(subItem => subItem.colorId == item.skuattributes[0].id)]
              current = {
                id:item.id,
                name:item.skuattributes[0].name,
                purchase_quantity:Number(current.purchase_quantity + Number(item.purchase_quantity)),
                purchase_amount:Number(Number(current.purchase_amount) + Number(item.purchase_amount)).toFixed(2),
                stock_quantity:Number(current.stock_quantity + Number(item.stock_quantity)),
                colorId:item.skuattributes[0].id,
                childrens:current.childrens
              }
              current.childrens.push({
                id:item.skuattributes[1].id,
                name:item.skuattributes[1].name,
                purchase_quantity:Number(item.purchase_quantity),
                purchase_amount:Number(item.purchase_amount).toFixed(2),
                stock_quantity:Number(item.stock_quantity),
              })
              state.singleGoodsPurchases[state.singleGoodsPurchases.findIndex(subItem => subItem.colorId == item.skuattributes[0].id)] = {...current}
            }
          }
        })
      }
      return {...state}
    },

    setShowStockList(state,{payload}) {
      state.singleGoodsStocks = []
      if(payload.length === 0) {
        state.singleGoodsStocks = payload
      }else {
        payload.forEach( item => {
          if(item.skuattributes.length === 0) {
            state.singleGoodsStocks.push({
              id: item.id,
              name:'',
              sales_quantity:item.sales_quantity,
              purchase_quantity:Number(item.purchase_quantity).toFixed(2),
              stock_quantity:item.stock_quantity
            })
          }else if(item.skuattributes.length === 1) {
            state.singleGoodsStocks.push({
              id:item.id,
              name:item.skuattributes[0].name,
              sales_quantity:Number(item.sales_quantity),
              purchase_quantity:Number(item.purchase_quantity).toFixed(2),
              stock_quantity:Number(item.stock_quantity)
            })
          }else if(item.skuattributes.length === 2) {
            if(!state.singleGoodsStocks.some( subItem => subItem.colorId == item.skuattributes[0].id)) {
              state.singleGoodsStocks.push({
                id:item.id,
                name:item.skuattributes[0].name,
                sales_quantity:Number(item.sales_quantity),
                purchase_quantity:Number(item.purchase_quantity).toFixed(2),
                stock_quantity:Number(item.stock_quantity),
                colorId:item.skuattributes[0].id,
                childrens:[{
                  id:item.skuattributes[1].id,
                  name:item.skuattributes[1].name,
                  sales_quantity:Number(item.sales_quantity),
                  purchase_quantity:Number(item.purchase_quantity).toFixed(2),
                  stock_quantity:Number(item.stock_quantity),
                }],
              })
            }else {
              let current = state.singleGoodsStocks[state.singleGoodsStocks.findIndex(subItem => subItem.colorId == item.skuattributes[0].id)]
              current = {
                id:item.id,
                name:item.skuattributes[0].name,
                sales_quantity:Number(current.sales_quantity + Number(item.sales_quantity)),
                purchase_quantity:Number(Number(current.purchase_quantity) + Number(item.purchase_quantity)).toFixed(2),
                stock_quantity:Number(current.stock_quantity + Number(item.stock_quantity)),
                colorId:item.skuattributes[0].id,
                childrens:current.childrens
              }
              current.childrens.push({
                id:item.skuattributes[1].id,
                name:item.skuattributes[1].name,
                sales_quantity:Number(item.sales_quantity),
                purchase_quantity:Number(item.purchase_quantity).toFixed(2),
                stock_quantity:Number(item.stock_quantity),
              })
              state.singleGoodsStocks[state.singleGoodsStocks.findIndex(subItem => subItem.colorId == item.skuattributes[0].id)] = {...current}
            }
          }
        })
      }
      return {...state}
    }

  },

};




















