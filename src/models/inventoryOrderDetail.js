import * as inventoryOrderService from '../services/inventoryOrder'
import * as printService from '../services/print'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'inventoryOrderDetail',

  state: {
    singleOrderDetail:{}
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({pathname}) => {
        const match = pathToRegexp('/bill/inventory-detail/:id').exec(pathname)
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
      const data = yield call(inventoryOrderService.getSingle,payload)
      yield put({type:'setShowData',payload:data.result.data})
    },

    *deleteSingle({payload},{call,put}) {
      const data = yield call(inventoryOrderService.deleteSingle,payload)
    },

    *printInventoryOrder({payload},{call,put}) {
      const data = yield call(printService.printInventoryOrder,payload)
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
      state.singleOrderDetail.losses_quantity = payload.losses_quantity;
      state.singleOrderDetail.losses_amount = payload.losses_amount;
      state.singleOrderDetail.profit_quantity = payload.profit_quantity;
      state.singleOrderDetail.profit_amount = payload.profit_amount;
      /*
        item_ref
        color
        size
        before_number
        after_number
        remark
      */
      let hasItems = [];
      state.singleOrderDetail.itemList = [];
      state.singleOrderDetail.itemExtraList = {};
      payload.inventorydocskus.data.forEach( n => {
        if(hasItems.some( _ => _ == n.skustock.data.item_id)) {
          if(n.skustock.data.sku.data.skuattributes.data.length == 1) {
            if(!state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`]) {
              state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`] = [];
              state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`].push(state.singleOrderDetail.itemList.find( _ => _.item_id == n.skustock.data.item_id))
            }
            state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`].push({
              id:n.id,
              item_id:n.skustock.data.item_id,
              item_ref:n.skustock.data.item_id,
              color:n.skustock.data.sku.data.skuattributes.data[0].name,
              size:'-',
              before_number:n.before_stock,
              after_number:n.after_stock,
              remark: n.remark || '-'
            })
            let current = JSON.parse(JSON.stringify(state.singleOrderDetail.itemList.find( _ => _.item_id == n.skustock.data.item_id)))
            current.color = '多颜色';
            current.remark = '多备注';
            current.before_number = Number(current.before_number) + Number(n.before_stock);
            current.after_number = Number(current.after_number) + Number(n.after_stock);
            state.singleOrderDetail.itemList[state.singleOrderDetail.itemList.findIndex( _ => _.item_id == n.skustock.data.item_id)]  = current
          }else if(n.skustock.data.sku.data.skuattributes.data.length == 2) {
            if(!state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`]) {
              state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`] = [];
              state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`][0] = [];
              state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`][0].push({
                name:state.singleOrderDetail.itemList.find( _ => _.item_id == n.skustock.data.item_id).size
              })
              state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`].push({
                colorId:state.singleOrderDetail.itemList.find( _ => _.item_id == n.skustock.data.item_id).colorId,
                name:state.singleOrderDetail.itemList.find( _ => _.item_id == n.skustock.data.item_id).color,
                children:[{
                  sizeId:state.singleOrderDetail.itemList.find( _ => _.item_id == n.skustock.data.item_id).sizeId,
                  name: `${state.singleOrderDetail.itemList.find( _ => _.item_id == n.skustock.data.item_id).before_number} - ${state.singleOrderDetail.itemList.find( _ => _.item_id == n.skustock.data.item_id).after_number}`,
                  remark:state.singleOrderDetail.itemList.find( _ => _.item_id == n.skustock.data.item_id).remark
                }]
              })
            }
            if(!state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`][0].some( _ => _.name == n.skustock.data.sku.data.skuattributes.data[1].name)) {
              state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`][0].push({
                name:n.skustock.data.sku.data.skuattributes.data[1].name,
              })
            }
            if(state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`].some( _ => _.colorId == n.skustock.data.sku.data.skuattributes.data[0].id)) {
              state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`][state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`].findIndex( _ => _.colorId == n.skustock.data.sku.data.skuattributes.data[0].id)].children.push({
                sizeId:n.skustock.data.sku.data.skuattributes.data[1].id,
                name:`${n.before_stock} - ${n.after_stock}`,
                remark:n.remark || '-'
              })
            }else {
              state.singleOrderDetail.itemExtraList[`${n.skustock.data.item_id}`].push({
                colorId:n.skustock.data.sku.data.skuattributes.data[0].id,
                name:n.skustock.data.sku.data.skuattributes.data[0].name,
                children:[{
                  sizeId:n.skustock.data.sku.data.skuattributes.data[1].id,
                  name:`${n.before_stock} - ${n.after_stock}`,
                  remark:n.remark || '-'
                }]
              })
            }
            let current = JSON.parse(JSON.stringify(state.singleOrderDetail.itemList.find( _ => _.item_id == n.skustock.data.item_id)))
            current.color = '多颜色';
            current.size = '多尺寸';
            current.remark  = '多备注';
            current.before_number = Number(current.before_number) + Number(n.before_stock);
            current.after_number = Number(current.after_number) + Number(n.after_stock);
            state.singleOrderDetail.itemList[state.singleOrderDetail.itemList.findIndex( _ => _.item_id == n.skustock.data.item_id)] = current;
          }
        }else {
          hasItems.push(n.skustock.data.item_id);
          if(n.skustock.data.sku.data.skuattributes.data.length == 0) {
            state.singleOrderDetail.itemList.push({
              id:n.id,
              item_id:n.skustock.data.item_id,
              item_ref:n.skustock.data.item_id,
              color:'-',
              size:'-',
              before_number:n.before_stock,
              after_number:n.after_stock,
              remark: n.remark || '-'
            })
          }else if(n.skustock.data.sku.data.skuattributes.data.length == 1) {
            state.singleOrderDetail.itemList.push({
              id:n.id,
              item_id:n.skustock.data.item_id,
              item_ref:n.skustock.data.item_id,
              color:n.skustock.data.sku.data.skuattributes.data[0].name,
              size:'-',
              before_number:n.before_stock,
              after_number:n.after_stock,
              remark: n.remark || '-'
            })
          }else if(n.skustock.data.sku.data.skuattributes.data.length == 2) {
            state.singleOrderDetail.itemList.push({
              id:n.id,
              item_id:n.skustock.data.item_id,
              item_ref:n.skustock.data.item_id,
              colorId:n.skustock.data.sku.data.skuattributes.data[0].id,
              sizeId:n.skustock.data.sku.data.skuattributes.data[1].id,
              color:n.skustock.data.sku.data.skuattributes.data[0].name,
              size:n.skustock.data.sku.data.skuattributes.data[1].name,
              before_number:n.before_stock,
              after_number:n.after_stock,
              remark: n.remark || '-'
            })
          }
        }
      })
      state.singleOrderDetail.operationSource = payload.docactionables.data;
      return {...state}
    }
  },
};
