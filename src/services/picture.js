import {apiBase,token} from '../common/index'
import request from '../utils/request';
import fetch from 'dva/fetch';

export async function upload (params) {
  // return request(`${apiBase}/api/images`,{
  //   method: 'POST',
  //   headers: { "Authorization": token() },
  //   body: params
  // // })
  const formData = new FormData();
  formData.append('image_name',params.image_name)
  formData.append('image_file',params.image_file)
  fetch(`${apiBase}/api/images`,{
    method: 'POST',
    headers: { "Authorization": token() },
    body: formData
  })
}