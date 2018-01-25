import * as countryService from '../services/country'
import {message} from 'antd'
export default  {

  namespace: 'country',

  state: {
    country:[]
  },

  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({type:'getList'})
    },
  },

  effects: {
    *getList({payload},{call,put}) {
      const data = yield call(countryService.getList)
      yield put({type:'setCountryState',payload: data.result.data[0].provinces.data})
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

    setCountryState (state,{payload}) {
      state.country = payload.map((item)=>{
        let current = {};
        current = {
          value:`${item.id}`,
          label:item.name,
          children:[],
        }
        item.cities.data.forEach((subItem)=>{
          current.children.push({
            value:`${subItem.id}`,
            label:subItem.name
          })
        })
        return current
      })
      return {...state}
    }

  },

};
