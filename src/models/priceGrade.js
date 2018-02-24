import * as priceGradeService from '../services/priceGrade'
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
    },

    *createSingle({payload},{call,put}) {
      yield call(priceGradeService.createSingle,payload)
    },

    *editSingle({payload},{call,put}) {
      yield call(priceGradeService.editSingle,payload)
    },

    *deleteSingle({payload},{call,put}) {
      yield call(priceGradeService.deleteSingle,payload)
    },
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },
  },

};
