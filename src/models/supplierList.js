import * as supplierService from '../services/supplier'
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

  namespace: 'supplierList',

  state: {
    supplierList:[],
    supplierPagination:{},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({type:'getList',payload:{...condition}})
    },
  },

  effects: {
    *getList({payload},{call,put}) {
      const data = yield call(supplierService.getList,payload)
      yield put({type:'setState',payload:{
        supplierList: data.result.data,
        supplierPagination: data.result.meta.pagination
      }})
    },

    *deleteSingle({payload},{call,put}) {
      const data = yield call(supplierService.deleteSingle,payload)
    },

    *changeSupplierStatus({payload},{call,put}) {
      const data = yield call(supplierService.changeSupplierStatus,payload)
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },
  },

};
