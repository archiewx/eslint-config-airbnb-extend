import * as deliverOrderService from '../services/deliverOrder'
import * as printService from '../services/print'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'deliverOrderDetail',

  state: {
    singleOrderDetail:{}
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({pathname}) => {
        const match = pathToRegexp('/bill/deliver-detail/:id').exec(pathname)
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
      const data = yield call(deliverOrderService.getSingle,payload)
      yield put({type:'setShowData',payload:data.result.data})
    },

    *printDeliverOrder({payload},{call,put}) {
      const data = yield call(printService.printDeliverOrder,payload)
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setShowData (state,{payload}) {
      state.singleOrderDetail.id = payload.id;
      state.singleOrderDetail.number = payload.number;
      state.singleOrderDetail.remark = payload.remark || '无';
      state.singleOrderDetail.total_quantity = payload.total_quantity;
      state.singleOrderDetail.total_count = payload.total_count;
      state.singleOrderDetail.fromwarehouse = payload.fromwarehouse.data.name;
      state.singleOrderDetail.towarehouse = payload.towarehouse.data.name;
      state.singleOrderDetail.status = payload.status;
      if(payload.status == 1) {
        state.singleOrderDetail.sendStatus = '未发货';
        state.singleOrderDetail.buyStatus = '未入货';
      }else if(payload.status == 2) {
        state.singleOrderDetail.sendStatus = '已发货';
        state.singleOrderDetail.buyStatus = '未入货';
      }else if(payload.status == 3) {
        state.singleOrderDetail.sendStatus = '已发货';
        state.singleOrderDetail.buyStatus = '已入货';
      }
      /*
        item_ref
        color
        size
        quantity
        remark
      */
      let hasItems = [];
      state.singleOrderDetail.itemList = [];
      state.singleOrderDetail.itemExtraList = {};
      payload.transferdocskus.data.forEach( n => {
        if(hasItems.some( _ => _ == n.sku.data.item_id)) {
          if(n.sku.data.skuattributes.data.length == 1) {
            if(!state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`]) {
              state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`] = [];
              state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`].push(state.singleOrderDetail.itemList.find( _ => _.item_id == n.sku.data.item_id));
            }
            state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`].push({
              id:n.id,
              item_id:n.sku.data.item_id,
              item_ref: n.sku.data.item.data.item_ref,
              color: n.sku.data.skuattributes.data[0].name,
              size:'-',
              quantity: `${n.quantity} x ${n.unit_number}`,
              number: n.quantity,
              remark: n.remark || '-',
            })
            let current = JSON.parse(JSON.stringify(state.singleOrderDetail.itemList[state.singleOrderDetail.itemList.findIndex( _ => _.item_id == n.sku.data.item_id)]))
            current.color = '多颜色';
            current.remark = '多备注';
            current.quantity = `${Number(n.quantity) + Number(current.number)} x ${n.unit_number}`;
            state.singleOrderDetail.itemList[state.singleOrderDetail.itemList.findIndex(_ => _.item_id == n.sku.data.item_id)] = current;
          }else if(n.sku.data.skuattributes.data.length == 2) {
            if(!state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`]) {
              state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`] = [];
              state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`][0] = [];
              state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`][0].push({
                name: state.singleOrderDetail.itemList.find( _ => _.item_id == n.sku.data.item_id).size
              })
              state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`].push({
                colorId:state.singleOrderDetail.itemList.find( _ => _.item_id == n.sku.data.item_id).colorId,
                name: state.singleOrderDetail.itemList.find( _ => _.item_id == n.sku.data.item_id).color,
                children: [{
                  quantity:state.singleOrderDetail.itemList.find( _ => _.item_id == n.sku.data.item_id).quantity,
                  remark:state.singleOrderDetail.itemList.find( _ => _.item_id == n.sku.data.item_id).remark
                }]
              })
            }
            if(!state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`][0].some( _ => _.name == n.sku.data.skuattributes.data[1].name)) {
              state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`][0].push({
                name: n.sku.data.skuattributes.data[1].name
              })
            }
            if(state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`].some( _ => _.colorId == n.sku.data.skuattributes.data[0].id)) {
              state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`][state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`].findIndex( _ => _.colorId == n.sku.data.skuattributes.data[0].id)].children.push({
                quantity: `${n.quantity} x ${n.unit_number}`,
                remark: n.remark || '-',
              })
            }else {
              state.singleOrderDetail.itemExtraList[`${n.sku.data.item_id}`].push({
                colorId:n.sku.data.skuattributes.data[0].id,
                name:n.sku.data.skuattributes.data[0].name,
                children:[{
                  quantity:`${n.quantity} x ${n.unit_number}`,
                  remark: n.remark || '-',
                }]
              })
            }
            let current = JSON.parse(JSON.stringify(state.singleOrderDetail.itemList[state.singleOrderDetail.itemList.findIndex( _ => _.item_id == n.sku.data.item_id)]))
            current.color = '多颜色';
            current.size = '多尺码';
            current.remark = '多备注';
            current.quantity = `${Number(n.quantity) + Number(current.number)} x ${n.unit_number}`;
            state.singleOrderDetail.itemList[state.singleOrderDetail.itemList.findIndex(_ => _.item_id == n.sku.data.item_id)] = current;
          }
        }else {
          hasItems.push(n.sku.data.item_id)
          if(n.sku.data.skuattributes.data.length == 0) {
            state.singleOrderDetail.itemList.push({
              id:n.id,
              item_id:n.sku.data.item_id,
              item_ref: n.sku.data.item.data.item_ref,
              color: '-',
              size:'-',
              quantity: `${n.quantity} x ${n.unit_number}`,
              number: n.quantity,
              remark: n.remark || '-',
            })
          }else if(n.sku.data.skuattributes.data.length == 1) {
            state.singleOrderDetail.itemList.push({
              id:n.id,
              item_id:n.sku.data.item_id,
              item_ref: n.sku.data.item.data.item_ref,
              color: n.sku.data.skuattributes.data[0].name,
              size:'-',
              quantity: `${n.quantity} x ${n.unit_number}`,
              number: n.quantity,
              remark: n.remark || '-',
            })
          }else if(n.sku.data.skuattributes.data.length == 2) {
            state.singleOrderDetail.itemList.push({
              id:n.id,
              item_id:n.sku.data.item_id,
              item_ref: n.sku.data.item.data.item_ref,
              color: n.sku.data.skuattributes.data[0].name,
              colorId:n.sku.data.skuattributes.data[0].id,
              size:n.sku.data.skuattributes.data[1].name,
              sizeId:n.sku.data.skuattributes.data[1].id,
              quantity: `${n.quantity} x ${n.unit_number}`,
              number: n.quantity,
              remark: n.remark || '-',
            })
          }
        }
      })
      state.singleOrderDetail.operationSource = payload.docactionables.data;
      return {...state}
    }
  },
};



























