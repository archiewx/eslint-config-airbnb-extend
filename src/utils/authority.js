export function getToken() {
  return sessionStorage.getItem('auth');
}

export function setToken(auth) {
  return sessionStorage.setItem('auth', auth);
}
