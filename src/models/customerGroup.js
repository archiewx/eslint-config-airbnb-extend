import * as customerGroupService from '../services/customerGroup'
import {message} from 'antd'
export default  {

  namespace: 'customerGroup',

  state: {
    customerGroups:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      
    },
  },

  effects: {
    *getList({payload},{call,put}) {
      const data = yield call(customerGroupService.getList)
      yield put({type:'setCustomerGroup',payload:data.result.data})
    },

    *createSingle ({payload},{call,put}) {
      const data = yield call(customerGroupService.createSingle,payload)
      return data
    },

    *editSingle ({payload},{call,put}) {
      const data = yield call(customerGroupService.editSingle,payload)
      return data
    },

    *deleteSingle ({payload},{call,put}) {
      yield call(customerGroupService.deleteSingle,payload)
    },

    *editSort ({payload},{call,put}) {
      yield call(customerGroupService.editSort,payload)
    }

  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setCustomerGroup (state,{payload}) {
      state.customerGroups = [];
      payload.forEach( (n,i) => {
        state.customerGroups.push({
          id: n.id,
          name: n.name,
          sort: n.sort,
          used_quantity: n.used_quantity,
        })
        if(!!n.children.data.length) {
          state.customerGroups[i].children = []
          n.children.data.forEach( m => {
            state.customerGroups[i].children.push({
              id: `${n.id}_${m.id}`,
              uid: m.id,
              name: m.name,
              sort: m.sort,
              parent_id: m.parent_id,
              used_quantity: m.used_quantity,
            })
          })
        }
      })
      return {...state}
    },

    setSortMove(state,{payload:{item,moveWay}}) {
      if(item.uid) {
        let currentGoodsGroup = state.customerGroups.find( n => n.id == item.parent_id).children;
        moveWay == 'up' ? null : currentGoodsGroup.reverse();
        currentGoodsGroup.forEach((n,i) => {
          if(n.uid == item.uid) {
            i == 0 ? '' : (
              currentGoodsGroup.splice(i,1),
              currentGoodsGroup.splice(i-1,0,n)
            )
          }
        })
        moveWay == 'up' ? null : currentGoodsGroup.reverse();
        currentGoodsGroup.forEach((item,index)=>{
          item.sort = index;
        })
        state.customerGroups.find( n => n.id == item.parent_id).children = currentGoodsGroup;
      }else {
        moveWay == 'up' ? null : state.customerGroups.reverse();
        state.customerGroups.forEach( (n,i) => {
          if(n.id == item.id) {
            i == 0 ? '' : (
              state.customerGroups.splice(i,1),
              state.customerGroups.splice(i-1,0,n)
            )
          }
        })
        moveWay == 'up' ? null : state.customerGroups.reverse();
        state.customerGroups.forEach((item,index)=>{
          item.sort = index;
        })
      }
      return {...state}
    }
  },

};
