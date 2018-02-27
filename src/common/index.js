import qs from 'qs'

const apiBase = 'http://duoke3api-beta.duoke.net'
const imageApiBase = 'http://duoke3-image.oss-cn-hangzhou.aliyuncs.com'
// http://duoke3api-beta.duoke.net
//'http://api3.duoke.net' 

const token = JSON.parse(sessionStorage.getItem('token')) ||  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImF1ZCI6InVzZXIiLCJ0Y3QiOjE1MTY2MDk2MzF9.6G7wSCr0vjp_2OuK9V-x5h-KvX4AYnq6S15FYNnZhQE'

module.exports = {
  
  apiBase,
  token,
  imageApiBase

}
