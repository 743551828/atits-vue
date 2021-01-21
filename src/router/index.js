import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/Login'),
    hidden: true
  },

  {
    path: '/',
    component: () => import('@/layout'),
    redirect: '/Home',
    children: [{
      path: 'Home',
      name: 'Home',
      component: () => import('@/views/Home'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/Management',
    component: () => import('@/layout'),
    redirect: '/Management/UserManagement',
    name: 'Management',
    meta: { title: '运维系统', icon: 'el-icon-setting' },
    children: [
      {
        path: 'UserManagement',
        name: 'UserManagement',
        component: () => import('@/views/Management/UserManagement'),
        meta: { title: '用户管理', icon: 'el-icon-user-solid' }
      },
      {
        path: 'RoleManagement',
        name: 'RoleManagement',
        component: () => import('@/views/Management/RoleManagement'),
        meta: { title: '角色管理', icon: 'el-icon-user' }
      },
      {
        path: 'ResourceManagement',
        name: 'ResourceManagement',
        component: () => import('@/views/Management/ResourceManagement'),
        meta: { title: '菜单管理', icon: 'el-icon-menu' }
      },
      {
        path: 'PermissionManagement',
        name: 'PermissionManagement',
        component: () => import('@/views/Management/PermissionManagement'),
        meta: { title: '数据权限管理', icon: 'el-icon-s-data' }
      },
      {
        path: 'DepartmentLevelManagement',
        name: 'DepartmentLevelManagement',
        component: () => import('@/views/Management/DepartmentLevelManagement'),
        meta: { title: '组织层级管理', icon: 'el-icon-office-building' }
      }
      
    ]
  }

]

export const asyncRoutes = []

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
