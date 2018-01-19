import qs from 'qs'

const apiBase = 'http://api3.duoke.net'

const token = qs.parse(location.hash.slice(location.hash.indexOf('?token')+1)).token || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEwMSwiYXVkIjoidXNlciIsInRjdCI6MTUxNjMzNDE1Mn0.y8hytGwPiaDfVc6CsKEznPbMVOH8QWi1Au18NfhSCrU'

module.exports = {
  
  apiBase,
  token

}
