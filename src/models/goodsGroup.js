import * as goodsGroupService from '../services/goodsGroup'
import {message} from 'antd'
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
    *getGoodsGroup ({payload},{call,put}) {
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
