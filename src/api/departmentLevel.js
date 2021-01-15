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
