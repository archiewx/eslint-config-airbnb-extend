import * as saleOrderService from '../services/saleOrder'
import * as printService from '../services/print'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'saleOrderDetail',

  state: {
    singleOrderDetail:{}
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({pathname}) => {
        const match = pathToRegexp('/bill/sale-detail/:id').exec(pathname)
        if(match) {
          dispatch({type:'setState',payload:{
            singleOrderDetail:{}
          }})
          dispatch({type:'getSingle',payload:{
            id:match[1]
          }})
        }
      })
    },
  },

  effects: {
    *getSingle({payload},{call,put}) {
      const data = yield call(saleOrderService.getSingle,payload)
      yield put({type:'setShowData',payload:data.result.data})
    },

    *printSaleOrder({payload},{call,put}) {
      const data = yield call(printService.printSaleOrder,payload)
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setShowData (state,{payload}) {
      console.log(payload)
      state.singleOrderDetail.id = payload.id;
      state.singleOrderDetail.number = payload.number;
      state.singleOrderDetail.createShop = payload.shop.data.name;
      state.singleOrderDetail.seller = payload.seller.data.name;
      state.singleOrderDetail.customer = payload.customer.data.name;
      if(payload.delivery_way == '1') {
        state.singleOrderDetail.deliverWay = '立即自提';
      }else if(payload.delivery_way == '2') {
        state.singleOrderDetail.deliverWay = '稍后自提';
      }else if(payload.delivery_way == '3') {
        state.singleOrderDetail.deliverWay = '物流运输';
      }else if(payload.delivery_way == '4') {
        state.singleOrderDetail.deliverWay = '稍后拼包'; 
      }
      state.singleOrderDetail.label = payload.doctags.data.length ? payload.doctags.data.map( n => n.name).join('、') : '「无」'
      state.singleOrderDetail.remark = payload.remark;

      return {...state}
    }



  },

};
