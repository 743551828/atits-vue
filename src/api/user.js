import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/security/sec/auth/v1/os/login-dev',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `/security/sec/auth/os/get/user/info/${token}`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
