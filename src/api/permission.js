import request from '@/utils/request'

export function findPage(data) {
  return request({
    url: '/security/sec/permission/find/findByPage',
    method: 'post',
    data
  })
}

export function deletePermission(data) {
  return request({
    url: '/security/sec/permission/delete',
    method: 'delete',
    data
  })
}

export function save(data) {
  return request({
    url: '/security/sec/permission/save',
    method: 'post',
    data
  })
}

export function turn(data) {
  return request({
    url: '/security/sec/permission/role/turn',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/security/sec/permission/update',
    method: 'put',
    data
  })
}

export function findByRoleCode(data) {
  return request({
    url: '/security/sec/permission/find/role',
    method: 'post',
    data
  })
}

