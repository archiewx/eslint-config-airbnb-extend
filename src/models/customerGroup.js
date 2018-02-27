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
      yield call(customerGroupService.createSingle,payload)
    },

    *editSingle ({payload},{call,put}) {
      yield call(customerGroupService.editSingle,payload)
    },

    *deleteSingle ({payload},{call,put}) {
      yield call(customerGroupService.deleteSingle,payload)
    },

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
    }
  },

};
