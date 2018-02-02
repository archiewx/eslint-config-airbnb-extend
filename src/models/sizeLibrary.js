import * as sizeLibraryService from '../services/sizeLibrary'
export default  {

  namespace: 'sizeLibrary',

  state: {
    sizeLibrarys:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      
    },
  },

  effects: {
    *getList ({payload},{call,put}) {
      const data = yield call(sizeLibraryService.getList) 
      yield put({type:'setState',payload:{
        sizeLibrarys:data.result.data.skuattributes.data,
      }})
    },
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

  },

};
