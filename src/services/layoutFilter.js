import { apiBase, token } from '../common/index';
import request from '../utils/request';

export async function getLayoutFilter(params) {
  return request(`${apiBase}/api/layouts`, {
    headers: { Authorization: token() },
  });
}
