
export  const apiBase = 'http://duoke3api-beta.duoke.net' 
export  const imageApiBase = 'http://duoke3-image.oss-cn-hangzhou.aliyuncs.com'
// 'http://duoke3api-beta.duoke.net'
//'http://duoke3api.duoke.net' 

export function token() {
  if(sessionStorage.getItem('token')) return sessionStorage.getItem('token').slice(1,sessionStorage.getItem('token').length-1) 
  else return sessionStorage.getItem('token')
}

// export function token() {
//   return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImF1ZCI6InVzZXIiLCJ0Y3QiOjE1MTY2MDk2MzF9.6G7wSCr0vjp_2OuK9V-x5h-KvX4AYnq6S15FYNnZhQE'
// } 

