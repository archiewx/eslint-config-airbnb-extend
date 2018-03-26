import { apiBase, token } from '../common/index';
import request from '../utils/request';

export async function getList(params) {
  return request(`${apiBase}/api/customergroups`, {
    headers: { Authorization: token() },
  });
}

export async function deleteSingle(params) {
  return request(`${apiBase}/api/customergroups/${params.id}`, {
    method: 'DELETE',
    headers: { Authorization: token() },
    body: params,
  });
}

export async function createSingle(params) {
  params.name = params.name.trim();
  return request(`${apiBase}/api/customergroups/`, {
    method: 'POST',
    headers: { Authorization: token() },
    body: params,
  });
}

export async function editSingle(params) {
  params.name = params.name.trim();
  const current = { ...params };
  delete current.id;
  return request(`${apiBase}/api/customergroups/${params.id}`, {
    method: 'PUT',
    headers: { Authorization: token() },
    body: current,
  });
}

export async function editSort(params) {
  const current = [];
  params.forEach((n) => {
    current.push({
      id: n.id,
      sort: n.sort,
    });
    if (n.children) {
      n.children.forEach((m) => {
        current.push({
          id: m.uid,
          sort: m.sort,
        });
      });
    }
  });
  return request(`${apiBase}/api/customergroups/sort`, {
    method: 'PUT',
    headers: { Authorization: token() },
    body: current,
  });
}
