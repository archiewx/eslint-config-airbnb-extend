import { apiBase, token } from '../common/index';
import request from '../utils/request';

export async function getItemLabel(params) {
  return request(`${apiBase}/api/docdetailtags`, {
    headers: { Authorization: token() },
  });
}

export async function editItemLableSingle(params) {
  params.name = params.name.trim();
  const current = { ...params };
  delete current.id;
  return request(`${apiBase}/api/docdetailtags/${params.id}`, {
    method: 'PUT',
    headers: { Authorization: token() },
    body: current,
  });
}

export async function getSaleOrderLabel(params) {
  return request(`${apiBase}/api/doctags?doctype_id=1`, {
    headers: { Authorization: token() },
  });
}

export async function editSaleOrderLabel(params) {
  params.name = params.name.trim();
  const current = { ...params };
  delete current.id;
  return request(`${apiBase}/api/doctags/${params.id}`, {
    method: 'PUT',
    headers: { Authorization: token() },
    body: current,
  });
}

export async function getPurchaseOrderLabel(params) {
  return request(`${apiBase}/api/doctags?doctype_id=2`, {
    headers: { Authorization: token() },
  });
}

export async function editPurchaseOrderLabel(params) {
  params.name = params.name.trim();
  const current = { ...params };
  delete current.id;
  return request(`${apiBase}/api/doctags/${params.id}`, {
    method: 'PUT',
    headers: { Authorization: token() },
    body: current,
  });
}
