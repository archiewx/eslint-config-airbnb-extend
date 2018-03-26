import { apiBase, token } from '../common/index';
import request from '../utils/request';

export async function printSaleOrder(params) {
  return request(`${apiBase}/api/print/salesorder`, {
    method: 'POST',
    headers: { Authorization: token() },
    body: params,
  });
}

export async function printPurchaseOrder(params) {
  return request(`${apiBase}/api/print/purchaseorder`, {
    method: 'POST',
    headers: { Authorization: token() },
    body: params,
  });
}

export async function printInventoryOrder(params) {
  return request(`${apiBase}/api/print/inventory_items`, {
    method: 'POST',
    headers: { Authorization: token() },
    body: params,
  });
}

export async function printDeliverOrder(params) {
  return request(`${apiBase}/api/print/transferdoc`, {
    method: 'POST',
    headers: { Authorization: token() },
    body: params,
  });
}

export async function printSettle(params) {
  return request(`${apiBase}/api/print/settledoc`, {
    method: 'POST',
    headers: { Authorization: token() },
    body: params,
  });
}
