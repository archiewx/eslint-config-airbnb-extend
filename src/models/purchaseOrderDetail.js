import * as purchaseOrderService from '../services/purchaseOrder'
import * as printService from '../services/print'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'purchaseOrderDetail',

  state: {
    singleOrderDetail:{}
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({pathname}) => {
        const match = pathToRegexp('/bill/purchase-detail/:id').exec(pathname)
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
      const data = yield call(purchaseOrderService.getSingle,payload)
      yield put({type:'setShowData',payload:data.result.data})
    },

    *printPurchaseOrder({payload},{call,put}) {
      const data = yield call(printService.printPurchaseOrder,payload)
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
      state.singleOrderDetail.intoWarehouse = payload.warehouse.data.name;
      state.singleOrderDetail.supplier = payload.supplier.data.name;
      if(payload.delivery_way == '1') {
        state.singleOrderDetail.deliverWay = '立即入库';
        state.singleOrderDetail.deliverStatus = '';
      }else if(payload.delivery_way == '2') {
        state.singleOrderDetail.deliverWay = '稍后入库';
        if(payload.delivery_status == 1) {
          state.singleOrderDetail.deliverStatus = '(未入库)';
        }else if(payload.delivery_status == 2) {
          state.singleOrderDetail.deliverStatus = '(已入库)';
        }
      }
      state.singleOrderDetail.delivery_status = payload.delivery_status
      state.singleOrderDetail.label = payload.doctags.data.length ? payload.doctags.data.map( n => n.name).join('、') : '「无」'
      state.singleOrderDetail.remark = payload.remark;
      state.singleOrderDetail.count = payload.purchaseorderskus.data.length;
      state.singleOrderDetail.quantity = payload.quantity;
      state.singleOrderDetail.due_fee = payload.due_fee;
      state.singleOrderDetail.paymentWays = [];
      state.singleOrderDetail.settle_way = payload.settle_way;
      state.singleOrderDetail.pay_status = payload.pay_status;
      if(payload.settle_way == 1) {
        payload.payments.data.forEach( n => {
          state.singleOrderDetail.paymentWays.push({
            name: n.paymentmethod.data.name,
            value: n.value
          })
        })
      }else {
        if(payload.pay_status == 1) {
          state.singleOrderDetail.paymentWays.push({
            name: '赊账',
            value: '(未结算)'
          })
        }else if(payload.pay_status == 3) {
          staet.singleOrderDetail.paymentWays.push({
            name: '赊账',
            value: '(已结算)'
          })
        }
      }
      /*
        item_ref
        color
        size
        price
        quantity
        total
        label
        remark
      */
      let hasItems = [];
      state.singleOrderDetail.itemList = [];
      state.singleOrderDetail.itemExtraList = {};
      state.singleOrderDetail.itemRecord = {};
      payload.purchaseorderskus.data.forEach( n => {
        if(hasItems.some( _ => _ == n.item_id)) {
          if(n.sku.data.skuattributes.data.length == 1) {
            if(!state.singleOrderDetail.itemExtraList[`${n.item_id}`]) {
              state.singleOrderDetail.itemExtraList[`${n.item_id}`] = [];
              state.singleOrderDetail.itemExtraList[`${n.item_id}`].push(state.singleOrderDetail.itemList.find( _ => _.item_id == n.item_id));
            }
            state.singleOrderDetail.itemExtraList[`${n.item_id}`].push({
              id:n.id,
              item_id:n.item_id,
              item_ref: n.item.data.item_ref,
              color: n.sku.data.skuattributes.data[0].name,
              size:'-',
              price: (Number(n.price)/Number(n.unit_number)).toFixed(2),
              quantity: `${n.quantity} x ${n.unit_number}`,
              number: n.quantity,
              total: (Number(n.deal_price)*Number(n.quantity)).toFixed(2),
              label: n.docdetailtag_id ? n.docdetailtag.data.name : '-',
              remark: n.remark || '-',
            })
            let current = JSON.parse(JSON.stringify(state.singleOrderDetail.itemList[state.singleOrderDetail.itemList.findIndex( _ => _.item_id == n.item_id)]))
            current.color = '多颜色';
            current.label = '多标签';
            current.remark = '多备注';
            current.quantity = `${Number(n.quantity) + Number(current.number)} x ${n.unit_number}`;
            current.total = (Number(current.total) + Number(n.deal_price)*Number(n.quantity)).toFixed(2);
            state.singleOrderDetail.itemList[state.singleOrderDetail.itemList.findIndex(_ => _.item_id == n.item_id)] = current;
          }else if(n.sku.data.skuattributes.data.length == 2) {
            if(!state.singleOrderDetail.itemExtraList[`${n.item_id}`]) {
              state.singleOrderDetail.itemExtraList[`${n.item_id}`] = [];
              state.singleOrderDetail.itemExtraList[`${n.item_id}`][0] = [];
              state.singleOrderDetail.itemExtraList[`${n.item_id}`][0].push({
                name: state.singleOrderDetail.itemList.find( _ => _.item_id == n.item_id).size
              })
              state.singleOrderDetail.itemExtraList[`${n.item_id}`].push({
                colorId:state.singleOrderDetail.itemList.find( _ => _.item_id == n.item_id).colorId,
                name: state.singleOrderDetail.itemList.find( _ => _.item_id == n.item_id).color,
                children: [{
                  sizeId:state.singleOrderDetail.itemList.find( _ => _.item_id == n.item_id).sizeId,
                  quantity:state.singleOrderDetail.itemList.find( _ => _.item_id == n.item_id).quantity,
                  name:state.singleOrderDetail.itemList.find( _ => _.item_id == n.item_id).size,
                  label:state.singleOrderDetail.itemList.find( _ => _.item_id == n.item_id).label,
                  remark:state.singleOrderDetail.itemList.find( _ => _.item_id == n.item_id).remark
                }]
              })
            }
            if(!state.singleOrderDetail.itemExtraList[`${n.item_id}`][0].some( _ => _.name == n.sku.data.skuattributes.data[1].name)) {
              state.singleOrderDetail.itemExtraList[`${n.item_id}`][0].push({
                name: n.sku.data.skuattributes.data[1].name
              })
            }
            if(state.singleOrderDetail.itemExtraList[`${n.item_id}`].some( _ => _.colorId == n.sku.data.skuattributes.data[0].id)) {
              state.singleOrderDetail.itemExtraList[`${n.item_id}`][state.singleOrderDetail.itemExtraList[`${n.item_id}`].findIndex( _ => _.colorId == n.sku.data.skuattributes.data[0].id)].children.push({
                sizeId:n.sku.data.skuattributes.data[1].id,
                quantity: `${n.quantity} x ${n.unit_number}`,
                name: n.sku.data.skuattributes.data[1].name,
                label: n.docdetailtag_id ? n.docdetailtag.data.name : '-',
                remark: n.remark || '-',
              })
            }else {
              state.singleOrderDetail.itemExtraList[`${n.item_id}`].push({
                colorId:n.sku.data.skuattributes.data[0].id,
                name:n.sku.data.skuattributes.data[0].name,
                children:[{
                  sizeId:n.sku.data.skuattributes.data[1].id,
                  quantity:`${n.quantity} x ${n.unit_number}`,
                  name: n.sku.data.skuattributes.data[1].name,
                  label: n.docdetailtag_id ? n.docdetailtag.data.name : '-',
                  remark: n.remark || '-',
                }]
              })
            }
            let current = JSON.parse(JSON.stringify(state.singleOrderDetail.itemList[state.singleOrderDetail.itemList.findIndex( _ => _.item_id == n.item_id)]))
            current.color = '多颜色';
            current.size = '多尺码';
            current.label = '多标签';
            current.remark = '多备注';
            current.quantity = `${Number(n.quantity) + Number(current.number)} x ${n.unit_number}`;
            current.total = (Number(current.total) + Number(n.deal_price)*Number(n.quantity)).toFixed(2);
            state.singleOrderDetail.itemList[state.singleOrderDetail.itemList.findIndex(_ => _.item_id == n.item_id)] = current;
          }
        }else {
          hasItems.push(n.item_id)
          if(n.sku.data.skuattributes.data.length == 0) {
            state.singleOrderDetail.itemList.push({
              id:n.id,
              item_id:n.item_id,
              item_ref: n.item.data.item_ref,
              color: '-',
              size:'-',
              price: (Number(n.price)/Number(n.unit_number)).toFixed(2),
              quantity: `${n.quantity} x ${n.unit_number}`,
              number: n.quantity,
              total: (Number(n.deal_price)*Number(n.quantity)).toFixed(2),
              label: n.docdetailtag_id ? n.docdetailtag.data.name : '-',
              remark: n.remark || '-',
            })
          }else if(n.sku.data.skuattributes.data.length == 1) {
            state.singleOrderDetail.itemList.push({
              id:n.id,
              item_id:n.item_id,
              item_ref: n.item.data.item_ref,
              color: n.sku.data.skuattributes.data[0].name,
              size:'-',
              price: (Number(n.price)/Number(n.unit_number)).toFixed(2),
              quantity: `${n.quantity} x ${n.unit_number}`,
              number: n.quantity,
              total: (Number(n.deal_price)*Number(n.quantity)).toFixed(2),
              label: n.docdetailtag_id ? n.docdetailtag.data.name : '-',
              remark: n.remark || '-',
            })
          }else if(n.sku.data.skuattributes.data.length == 2) {
            state.singleOrderDetail.itemList.push({
              id:n.id,
              item_id:n.item_id,
              item_ref: n.item.data.item_ref,
              color: n.sku.data.skuattributes.data[0].name,
              colorId:n.sku.data.skuattributes.data[0].id,
              size:n.sku.data.skuattributes.data[1].name,
              sizeId:n.sku.data.skuattributes.data[1].id,
              price: (Number(n.price)/Number(n.unit_number)).toFixed(2),
              quantity: `${n.quantity} x ${n.unit_number}`,
              number: n.quantity,
              total: (Number(n.deal_price)*Number(n.quantity)).toFixed(2),
              label: n.docdetailtag_id ? n.docdetailtag.data.name : '-',
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
