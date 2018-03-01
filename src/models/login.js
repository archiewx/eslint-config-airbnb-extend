import * as loginService from '../services/login'
import { reloadAuthorized } from '../utils/Authorized'
import * as configSettingService from '../services/configSetting'
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
    code:'',
    isQuerying:false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(()=>{
        if(location.hash.indexOf('user/login') > -1) {
          sessionStorage.clear()
          dispatch({type:'setState',payload:{
            isQuerying:false
          }})
          dispatch({type:'checkLogin'}) 
          dispatch({type:'pollQrcode'}) 
        }
      })
    },
  },

  effects: {
    *pollQrcode ({payload},{call,put,take,select}) {
      while(true) {
        const {isQuerying} = yield select(({login}) => (login))
        if(isQuerying) break;
        const data = yield call(loginService.createQrcode,payload)
        yield put({type:'setState',payload:{
          qrcode:data.result.data.qrcode,
          code:data.result.data.code
        }})
        yield call(delay, 1000*60*3);
      }
    },

    *checkLogin({payload},{call,put,select}) {
      while(true) {
        const {isQuerying,code} = yield select(({login}) => (login))
        if(isQuerying) break;
        const data = yield call(loginService.checkLogin,code)
        if(data.result) {
          sessionStorage.setItem('auth','user')
          sessionStorage.setItem('oncefetch',true)
          sessionStorage.setItem('token',JSON.stringify(data.result.data.token))
          yield put({type:'setState',payload:{
            isQuerying:true
          }})
          reloadAuthorized();
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
