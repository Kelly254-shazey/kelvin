const TOKEN_KEY = 'kellyflo_admin_token'
const USERNAME_KEY = 'kellyflo_admin_username'

function decodePayload(token) {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padding = (4 - (normalized.length % 4)) % 4
    const padded = normalized.padEnd(normalized.length + padding, '=')

    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

export function setAuth(token, username) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USERNAME_KEY, username)
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USERNAME_KEY)
}

export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null

  const payload = decodePayload(token)
  if (payload?.exp && Date.now() >= payload.exp * 1000) {
    clearAuth()
    return null
  }

  return token
}

export function getAdminUsername() {
  return localStorage.getItem(USERNAME_KEY)
}

export function isAuthenticated() {
  return Boolean(getToken())
}

