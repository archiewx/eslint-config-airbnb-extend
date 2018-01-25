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
    *getCustomerGroup({payload},{call,put}) {
      const data = yield call(customerGroupService.getListGroup)
      yield put({type:'setState',payload:{
        customerGroups:data.result.data
      }})
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },
  },

};
