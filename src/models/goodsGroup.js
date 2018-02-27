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

    *editSort ({payload},{call,put}) {
      yield call(goodsGroupService.editSort,payload)
    }

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
    },

    setSortMove(state,{payload:{item,moveWay}}) {
      if(item.uid) {
        let currentGoodsGroup = state.goodsGroups.find( n => n.id == item.parent_id).children;
        moveWay == 'up' ? null : currentGoodsGroup.reverse();
        currentGoodsGroup.forEach((n,i) => {
          if(n.uid == item.uid) {
            i == 0 ? '' : (
              currentGoodsGroup.splice(i,1),
              currentGoodsGroup.splice(i-1,0,n)
            )
          }
        })
        moveWay == 'up' ? null : currentGoodsGroup.reverse();
        currentGoodsGroup.forEach((item,index)=>{
          item.sort = index;
        })
        state.goodsGroups.find( n => n.id == item.parent_id).children = currentGoodsGroup;
      }else {
        moveWay == 'up' ? null : state.goodsGroups.reverse();
        state.goodsGroups.forEach( (n,i) => {
          if(n.id == item.id) {
            i == 0 ? '' : (
              state.goodsGroups.splice(i,1),
              state.goodsGroups.splice(i-1,0,n)
            )
          }
        })
        moveWay == 'up' ? null : state.goodsGroups.reverse();
        state.goodsGroups.forEach((item,index)=>{
          item.sort = index;
        })
      }
      return {...state}
    }


  },

};
