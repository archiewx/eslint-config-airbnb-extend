import { apiBase, token } from '../common/index';
import request from '../utils/request';

export async function getList(params) {
  return request(`${apiBase}/api/quantityrangegroups?include=quantityranges`, {
    headers: { Authorization: token() },
  });
}

export async function deleteSingle(params) {
  return request(`${apiBase}/api/quantityrangegroups/${params.id}`, {
    method: 'DELETE',
    headers: { Authorization: token() },
  });
}

export async function createSingle(params) {
  return request(`${apiBase}/api/quantityrangegroups/`, {
    method: 'POST',
    headers: { Authorization: token() },
    body: params,
  });
}
