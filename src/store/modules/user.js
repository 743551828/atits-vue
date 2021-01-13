import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    userCode: '',
    username: '',
    isAdmin: '',
    userDepartmentRole: '',
    resourceTree: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INFO: (state, info) => {
    state.info = info
  },
  SET_USER_CODE: (state, userCode) => {
    state.userCode = userCode
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_IS_ADMIN: (state, isAdmin) => {
    state.isAdmin = isAdmin
  },
  SET_USER_DEPARTMENT_ROLE: (state, userDepartmentRole) => {
    state.userDepartmentRole = userDepartmentRole
  },
  SET_RESOURCE_TREE: (state, resourceTree) => {
    state.resourceTree = resourceTree
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('token无效，请重新登录')
        }
        console.log(data);

        const info = data
        const username = data.username
        const userCode = data.code
        const isAdmin = data.isAdmin
        const userDepartmentRole = data.userDepartmentRoleVoList
        const resourceTree = data.resourceTreeVoList
        commit('SET_USER_CODE', userCode)
        commit('SET_USERNAME', username)
        commit('SET_IS_ADMIN', isAdmin)
        commit('SET_USER_DEPARTMENT_ROLE', userDepartmentRole)
        commit('SET_RESOURCE_TREE', resourceTree)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

