import request from '@/utils/request'

export function findByDepartmentLevelCode(data) {
  return request({
    url: '/security/sec/role/find/by/department/level',
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/security/sec/role/delete',
    method: 'delete',
    data
  })
}

export function save(data) {
  return request({
    url: '/security/sec/role/save',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/security/sec/role/update',
    method: 'put',
    data
  })
}

