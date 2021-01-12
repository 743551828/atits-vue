import Cookies from 'js-cookie'
import defaultSettings from '@/settings.js'


const TokenKey = defaultSettings.tokenKey

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
