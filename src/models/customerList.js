import * as customerService from '../services/customer'
import moment from 'moment';
const condition = {
  sorts: {
    created_at: 'desc'
  },
  page:1,
  per_page:10,
  date_type:'custom',
  sday:moment(new Date((new Date).getTime() - 7*24*60*60*1000),'YYYY-MM-DD').format('YYYY-MM-DD'),
  eday:moment(new Date(),'YYYY-MM-DD').format('YYYY-MM-DD')
}
export default  {

  namespace: 'customerList',

  state: {
    customerList:[],
    customerPagination:{},
    fifterCustomerServerData:{},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({type:'getList',payload:{...condition}})
    },
  },

  effects: {
    *getList({payload},{call,put}) {
      const data = yield call(customerService.getList,payload)
      yield put({type:'setState',payload:{
        customerList: data.result.data,
        customerPagination: data.result.meta.pagination
      }})
    },

    *deleteSingle({payload},{call,put}) {
      const data = yield call(customerService.deleteSingle,payload)
    },

    *changeCustomerStatus({payload},{call,put}) {
      const data = yield call(customerService.changeCustomerStatus,payload)
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setFilterCustomerServerData (state,{payload}) {
      let current = {}
      for(let key in payload) {
        if(payload[key]) {
          if(key == 'datePick') {
            current['date_type'] = 'custom'
            current['sday'] = payload[key][0]
            current['eday'] = payload[key][1]
          }else {
            current[`${key}_in`] = payload[key]
          }
        }
      }
      for(let key in current) {
        if(Array.isArray(current[key]) && !current[key].length) {
          delete current[key]
        }
      }
      state.fifterCustomerServerData = current
      return {...state}
    }
  },

};
