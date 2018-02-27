import * as loginService from '../services/login'
import { routerRedux } from 'dva/router';
const delay = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
export default  {

  namespace: 'login',

  state: {
    qrcode:'',
    isQuerying:false
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(()=>{
        dispatch({type:'checkLogin'})
        dispatch({type:'pollQrcode'})
      })
    },
  },

  effects: {
    *pollQrcode ({payload},{call,put,take,select}) {
      const {isQuerying} = yield select(({login}) => (login))
      while(isQuerying) {
        const data = yield call(loginService.createQrcode,payload)
        yield put({type:'setState',payload:{
          qrcode:data.result.data.qrcode
        }})
        yield call(delay, 1000*60*3);
      }
    },

    *checkLogin({payload},{call,put,select}) {
      const {isQuerying} = yield select(({login}) => (login))
      while(isQuerying) {
        const data = yield call(loginService.checkLogin)
        if(data.result) {
          sessionStorage.setItem('token',JSON.stringify(data.result.data.token))
          yield put({type:'setState',payload:{
            isQuerying:false
          }})
          yield put(routerRedux.push('/goods-list'))
        }else {
          yield call(delay, 1000);
        }
      }
    }
  },

  reducers: {

    setState (state, action) {
      return { ...state, ...action.payload }
    },

  },

};
