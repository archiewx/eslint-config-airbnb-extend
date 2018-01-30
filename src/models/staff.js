import * as staffService from '../services/staff'
import {message} from 'antd'
export default  {

  namespace: 'staff',

  state: {
    staffs:[]
  },

  subscriptions: {
    setup({ dispatch, history }) {
      
    },
  },

  effects: {
    *getList({payload},{call,put}) {
      const data = yield call(staffService.getList)
      yield put({type:'setState',payload:{
        staffs:data.result.data
      }})
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },
  },

};
