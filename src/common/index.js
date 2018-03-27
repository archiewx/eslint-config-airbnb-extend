
export const apiBase = process.env.NODE_ENV === 'development' ? 'http://duoke3api-beta.duoke.net' : 'http://duoke3api.duoke.net';
export const imageApiBase = 'http://duoke3-image.oss-cn-hangzhou.aliyuncs.com';
// 'http://duoke3api-beta.duoke.net'
// 'http://duoke3api.duoke.net'
export function token() {
  if (sessionStorage.getItem('token')) return sessionStorage.getItem('token').slice(1, sessionStorage.getItem('token').length - 1);
  else return sessionStorage.getItem('token');
}
