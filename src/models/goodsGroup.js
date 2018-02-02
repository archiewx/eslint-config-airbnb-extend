import * as goodsGroupService from '../services/goodsGroup'
export default  {

  namespace: 'goodsGroup',

  state: {
    goodsGroups:[]
  },

  subscriptions: {
    setup({ dispatch, history }) {
      
    },
  },

  effects: {
    *getList ({payload},{call,put}) {
      const data = yield call(goodsGroupService.getListGroup)
      yield put({type:'setState',payload:{
        goodsGroups:data.result.data
      }})
    },
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },
  },

};
