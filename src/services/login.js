import request from '../utils/request';

export async function createQrcode (params) {
  return request('http://duoke3api.duoke.net/api/auth/login_qrcode',{
    method:'POST',
    body:params
  })
}

export async function checkLogin (params) {
  return request(`http://duoke3api.duoke.net/api/auth/qrcode_token?code=${params}`)
}