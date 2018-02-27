import * as shopService from '../services/shop'
export default  {

  namespace: 'shop',

  state: {
    shops:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      
    },
  },

  effects: {
    *getList ({payload},{call,put}) {
      const data = yield call(shopService.getList)
      yield put({type:'setState',payload:{
        shops:data.result.data,
      }})
    },
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setShops (state,{payload}) {
      
      return {...state}
    }

  },

};
