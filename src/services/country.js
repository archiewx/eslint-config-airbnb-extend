import { apiBase, token } from '../common/index';
import request from '../utils/request';

export async function getList(params) {
  return request(`${apiBase}/api/countries`, {
    headers: { Authorization: token() },
  });
}

