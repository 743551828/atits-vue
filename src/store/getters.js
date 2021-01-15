const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  info: state => state.user.info,
  userCode: state => state.user.userCode,
  username: state => state.user.username,
  isAdmin: state => state.user.isAdmin,
  userDepartmentRole: state => state.user.userDepartmentRole,
  resourceTree: state => state.user.resourceTree
}
export default getters
