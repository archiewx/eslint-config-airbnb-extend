import * as priceGradeService from '../services/priceGrade'
import {message} from 'antd'
export default  {

  namespace: 'priceGrade',

  state: {
    priceGrades:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      
    },
  },

  effects: {
    *getList({payload},{call,put}) {
      const data = yield call(priceGradeService.getList)
      yield put({type:'setState',payload:{
        priceGrades:data.result.data
      }})
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },
  },

};
