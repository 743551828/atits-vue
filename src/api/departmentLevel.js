import request from '@/utils/request'

export function getChildrenList(parentCode) {
  return request({
    url: `/security/sec/department/level/find/all/children/${parentCode}`,
    method: 'get'
  })
}

export function save(data) {
  return request({
    url: `/security/sec/department/level/save`,
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: `/security/sec/department/level/update`,
    method: 'put',
    data
  })
}

export function findAll() {
  return request({
    url: `/security/sec/department/level/find/all`,
    method: 'get',
  })
}

export function deleteByRecursion(data) {
  return request({
    url: `/security/sec/department/level/deleteByRecursion`,
    method: 'delete',
    data
  })
}