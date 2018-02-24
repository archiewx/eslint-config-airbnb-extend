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
      const data = yield call(goodsGroupService.getList)
      yield put({type:'setGoodsGroup',payload:data.result.data})
    },

    *createSingle ({payload},{call,put}) {
      yield call(goodsGroupService.createSingle,payload)
    },

    *editSingle ({payload},{call,put}) {
      yield call(goodsGroupService.editSingle,payload)
    },

    *deleteSingle ({payload},{call,put}) {
      yield call(goodsGroupService.deleteSingle,payload)
    },

  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setGoodsGroup (state,{payload}) {
      state.goodsGroups = [];
      payload.forEach( (n,i) => {
        state.goodsGroups.push({
          id: n.id,
          name: n.name,
          sort: n.sort,
          used_quantity: n.used_quantity,
        })
        if(!!n.children.data.length) {
          state.goodsGroups[i].children = []
          n.children.data.forEach( m => {
            state.goodsGroups[i].children.push({
              id: `${n.id}_${m.id}`,
              uid: m.id,
              name: m.name,
              sort: m.sort,
              parent_id: m.parent_id,
              used_quantity: m.used_quantity,
            })
          })
        }
      })
      return {...state}
    }
  },

};
