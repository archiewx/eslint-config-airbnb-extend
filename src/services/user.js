import { apiBase, token } from '../common/index';
import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function getSingle(params) {
  return request(`${apiBase}/api/users/self_info`, {
    headers: { Authorization: token() },
  });
}
