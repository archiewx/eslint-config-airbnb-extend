import * as sizeLibraryService from '../services/sizeLibrary'
import * as sizeGroupService from '../services/sizeGroup'

export default  {

  namespace: 'size',

  state: {
    sizeLibrarys:[],
    sizeGroups:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getList ({payload},{call,put,all}) {
      const [data1,data2] = yield all([call(sizeLibraryService.getList),call(sizeGroupService.getList)])
      yield put({type:'setState',payload:{
        sizeLibrarys:data1.result.data.skuattributes.data,
        sizeGroups:data2.result.data
      }})
    },

    *getSizeLibrary({payload},{call,put}) {
      const data = yield call(sizeLibraryService.getList) 
      yield put({type:'setState',payload:{
        sizeLibrarys:data.result.data.skuattributes.data,
      }})
    },

    *getSizeGroup({payload},{call,put}) {
      const data = yield call(sizeGroupService.getList) 
      yield put({type:'setState',payload:{
        sizeGroups:data.result.data
      }})
    },

    *createSizeLibrarySingle({payload},{call,put}) {
      yield call(sizeLibraryService.createSingle,payload)
    },

    *editSizeLibrarySingle({payload},{call,put}) {
      yield call(sizeLibraryService.editSingle,payload)
    },

    *deleteSizeLibrarySingle({payload},{call,put}) {
      yield call(sizeLibraryService.deleteSingle,payload)
    },

    *createSizeGroupSingle({payload},{call,put}) {
      yield call(sizeGroupService.createSingle,payload)
    },

    *editSizeGroupSingle({payload},{call,put}) {
      yield call(sizeGroupService.editSingle,payload)
    },

    *deleteSizeGroupSingle({payload},{call,put}) {
      yield call(sizeGroupService.deleteSingle,payload)
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

  },

};
