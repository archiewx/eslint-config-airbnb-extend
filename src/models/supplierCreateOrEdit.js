import * as supplierService from '../services/supplier'
import * as pictureService from '../services/picture'
import pathToRegexp from 'path-to-regexp'
export default  {

  namespace: 'supplierCreateOrEdit',

  state: {
    serverData: {},
    showData: {},
    imageFile: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        const match = pathToRegexp('/relationship/supplier-edit/:id').exec(location.hash.slice(1,location.hash.length))
        if(match) {
          dispatch({type:'getSingle',payload:{id:match[1]}})
        }else {
          dispatch({type:'setState',payload:{showData:{}}})
        }
      })
    },
  },

  effects: {
    *createSingle({payload},{call,put,all}) {
      yield call(supplierService.createSingle,payload)
    },

    *getSingle({payload},{call,put,all}) {
      const data = yield call(supplierService.getSingle,payload)
      yield put({type:'setShowData',payload:data.result.data})
    },
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setShowData (state,{payload}) {
      state.showData.name = payload.name;
      state.showData.phone = payload.phone;
      state.showData.wechat = payload.wechat;
      state.showData.remark1 = payload.remark1;
      state.showData.addresses = payload.addresses.data.map( (item,index) => {
        return {
          uid: `${item.id}_${index}`,
          name: item.name,
          phone: item.phone,
          location: [item.province_id,item.city_id],
          default: item.default,
          address: item.address
        }
      })
      return {...state}
    },

    setServerData (state,{payload}) {
      state.serverData.name = payload.name;
      state.serverData.phone = payload.phone;
      state.serverData.wechat = payload.wechat;
      state.serverData.remark1 = payload.remark1;
      state.serverData.addresses = payload.addresses.map( item => {
        return {
          name: item.name,
          addresses: item.addresses,
          province_id: item.location[0],
          city_id: item.location[1],
          phone: item.phone,
          default: item.default,
        }
      })
      return {...state}
    }
  },

};
