const TOKEN_KEY = 'kellyflo_admin_token'
const USERNAME_KEY = 'kellyflo_admin_username'

export function setAuth(token, username) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USERNAME_KEY, username)
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USERNAME_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getAdminUsername() {
  return localStorage.getItem(USERNAME_KEY)
}

export function isAuthenticated() {
  return Boolean(getToken())
}

