import * as supplierService from '../services/supplier'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'supplierGoodsPurchaseDetail',

  state: {
    goodsPurchaseList:[],
    supplierId:'',
    itemId:'',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/relationship/supplier-detail/goods-purchase-detail/:id/:subId/:name').exec(location.hash.slice(1,location.hash.length))
        if(match) {
          dispatch({type:'setState',payload:{
            goodsPurchaseList:[],
          }})
          dispatch({type:'getList',payload:{
            id:match[1],
            subId:match[2],
            sorts:{
              last_purchase_time:'desc'
            }
          }})
        }
      })
    },
  },

  effects: {
    *getList({payload},{call,put}) {
      const data = yield call(supplierService.getGoodsPurchaseDetail,payload)
      yield put({type:'setGoodsPurchaseList',payload:data.result.skus})
      yield put({type:'setState',payload:{
        customerId:payload.id,
        itemId:payload.subId,
      }})
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setGoodsPurchaseList (state,{payload}) {
      state.goodsPurchaseList = []
      let data = payload.data;
      let expandedRowRender = {};
      if(data[0].skuattributes.length == 0) {
        data.forEach( item => {
          state.goodsPurchaseList.push({
            id: item.id,
            total_quantity:item.total_quantity,
            total_fee:item.total_fee,
            last_purchase_time:item.last_purchase_time,
          })
        })
      }else if(data[0].skuattributes.length == 1) {
        data.forEach( item => {
          state.goodsPurchaseList.push({
            id:item.skuattributes[0].id,
            skuId: item.id,
            name:item.skuattributes[0].name,
            total_quantity:item.total_quantity,
            total_fee:item.total_fee,
            last_purchase_time:item.last_purchase_time,
          })
        })
      }else if(data[0].skuattributes.length == 2) {
        data.forEach( (item,index) => {
          if(state.goodsPurchaseList.some( n => n.id == item.skuattributes[0].id)) {
            expandedRowRender[`${item.skuattributes[0].id}`].push({
              id: `${item.skuattributes[1].id}_${index}`,
              name:item.skuattributes[1].name,
              total_quantity:item.total_quantity,
              total_fee:item.total_fee,
              last_purchase_time:item.last_purchase_time,
            })
          }else {
            state.goodsPurchaseList.push({
              id: item.skuattributes[0].id,
              skuId: item.id,
              name:item.skuattributes[0].name,
              total_quantity:0,
              total_fee:0,
              last_purchase_time:item.last_purchase_time,
              children:[]
            })
            expandedRowRender[`${item.skuattributes[0].id}`] = [];
            expandedRowRender[`${item.skuattributes[0].id}`].push({
              id: `${item.skuattributes[1].id}_${index}`,
              name:item.skuattributes[1].name,
              total_quantity:item.total_quantity,
              total_fee:item.total_fee,
              last_purchase_time:item.last_purchase_time,
            })
          }
        })
        state.goodsPurchaseList.forEach( item => {
          item.children = expandedRowRender[item.id]
          item.total_quantity = expandedRowRender[item.id].reduce((sum,item) => (sum + Number(item.total_quantity)),0)
          item.total_fee = expandedRowRender[item.id].reduce((sum,item)=> (sum + Number(item.total_fee)),0)
        })         
      }
      return {...state}
    }
  },

};











