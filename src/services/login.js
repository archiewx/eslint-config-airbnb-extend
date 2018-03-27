import { apiBase, token } from '../common/index';
import request from '../utils/request';

export async function createQrcode(params) {
  return request(`${apiBase}/api/auth/login_qrcode`, {
    method: 'POST',
    body: params,
  });
}

export async function checkLogin(params) {
  return request(`${apiBase}/api/auth/qrcode_token?code=${params}`);
}
