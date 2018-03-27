import * as loginService from '../services/login';
import { reloadAuthorized } from '../utils/Authorized';
import * as configSettingService from '../services/configSetting';
import { getSingle } from '../services/user';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

const delay = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};
export default {

  namespace: 'login',

  state: {
    qrcode: '',
    code: '',
    isQuerying: false,
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(() => {
        if (location.hash.indexOf('user/login') > -1) {
          sessionStorage.clear();
          dispatch({ type: 'setState',
            payload: {
              isQuerying: false,
            } });
          dispatch({ type: 'checkLogin' });
          dispatch({ type: 'pollQrcode' });
        }
      });
    },
  },

  effects: {
    //获取二维码
    *pollQrcode({ payload }, { call, put, take, select }) {
      while (true) {
        const { isQuerying } = yield select(({ login }) => (login));
        if (isQuerying) break;
        const data = yield call(loginService.createQrcode, payload);
        yield put({ type: 'setState',
          payload: {
            qrcode: data.result.data.qrcode,
            code: data.result.data.code,
          } });
        yield call(delay, 1000 * 60 * 3);
      }
    },

    //检查返回token
    *checkLogin({ payload }, { call, put, select }) {
      while (true) {
        const { isQuerying, code } = yield select(({ login }) => (login));
        if (isQuerying) break;
        const data = yield call(loginService.checkLogin, code);
        if (data.result) {
          sessionStorage.setItem('auth', 'user');
          sessionStorage.setItem('oncefetch', true);
          sessionStorage.setItem('token', JSON.stringify(data.result.data.token));
          yield put({ type: 'setState',
            payload: {
              isQuerying: true,
              code: '',
            } });
          //用户信息获取
          const user = yield call(getSingle);
          sessionStorage.setItem('currentname', user.result.data.name);
          sessionStorage.setItem('currentavatar', `http://duoke3-image.oss-cn-hangzhou.aliyuncs.com/${user.result.data.role.data.avatar}`);
          reloadAuthorized();
          //跳转商品列表
          yield put(routerRedux.push('/goods-list'));
        } else {
          yield call(delay, 1000);
        }
      }
    },

    //登出
    *logout({ payload }, { call, put }) {
      yield put(routerRedux.push('/user'));
    },

  },

  reducers: {

    setState(state, action) {
      return { ...state, ...action.payload };
    },

  },

};
