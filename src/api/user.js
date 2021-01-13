import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sec/auth/v1/login-dev',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `/sec/auth/get/user/info/${token}`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
