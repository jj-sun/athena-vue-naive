import { asyncRoutes, constantRoutes } from '@/router/routes'
import type { RouteRecordRaw } from 'vue-router'
import { PermissState, IRootState } from '../interface'

/**
 * 判断是否拥有权限
 * @param roles 权限成员
 * @param route 路由对象
 * @returns Boolean
 */
function hasPermission(roles: string[], route: RouteRecordRaw) {
  if (route.meta?.roles) {
    return roles.some(role => route.meta!.roles?.includes(role))
  } else {
    return true
  }
}

/**
 * 过滤异步路由
 * @param routes 路由表
 * @param roles 权限
 * @returns RouteRecordRaw[] 树形路由表
 */
export function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]) {
  const res: RouteRecordRaw[] = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissState => ({
    routes: constantRoutes,
    addRoutes: []
  }),
  // mutations: {
  //   // 设置 routes
  //   SET_ROUTES: (state, routes) => {
  //     state.addRoutes = routes
  //     state.routes = constantRoutes.concat(routes)
  //   },
  // },
  actions: {

    // 生成路由
    generateRoutes(routes: any) {
      return new Promise(resolve => {
        let routelist = routes.constRoutes;
        this.addRoutes = routes
        this.routes = constantRoutes.concat(routes)
        resolve(routelist)
      })
    },
  },
})