import * as colorService from '../services/color'
export default  {

  namespace: 'color',

  state: {
    colors:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *getList ({payload},{call,put,take}) {
      const data = yield call(colorService.getList)
      yield put({type:'setState',payload:{
        colors:data.result.data.skuattributes.data,
      }})
    },

    *createSingle ({payload},{call,put}) {
      const data = yield call(colorService.createSingle,payload)
      return data;
    },

    *editSingle ({payload},{call,put}) {
      const data = yield call(colorService.editSingle,payload)
      return data;
    },

    *deleteSingle ({payload},{call,put}) {
      const data = yield call(colorService.deleteSingle,payload)
      return data;
    },

    *editSort ({payload},{call,put}) {
      yield call(colorService.editSort,payload)
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setSortMove(state,{payload:{currentId,moveWay}}) {
      moveWay == 'up' ? null : state.colors.reverse();
      state.colors.forEach( (n,i) => {
        if(n.id == currentId) {
          i == 0 ? '' : (
            state.colors.splice(i,1),
            state.colors.splice(i-1,0,n)
          )
        }
      })
      moveWay == 'up' ? null : state.colors.reverse();
      state.colors.forEach((item,index)=>{
        item.sort = index;
      })
      return {...state}
    }

  },

};
