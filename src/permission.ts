import {parseQuery, RouteRecordRaw, stringifyQuery} from 'vue-router'
import { useTitle } from '@vueuse/core'
import router from '@/router'
import store from '@/store'
import { getToken } from "@/utils/cookies"
import { generateIndexRouter } from "@/utils/util";

const title = useTitle()

// 白名单
const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async (to, from, next) => {
  // 开启加载条
  window.$loadingBar.start()

  // 动态标题栏
  title.value = `后台管理-${to.meta.title}`

  if(getToken()) {
    if(to.path === '/login') {
      next({
        path: '/dashboard'
      })
      window.$loadingBar.finish()
    }
  } else {
    if(store.getters.permissionList.length === 0) {
      store.dispatch('user/GetPermissionList').then((res: any) => {
        const menuData = res.result.menuTree
        if(menuData === null || menuData === undefined) {
          return
        }
        let constRoutes = generateIndexRouter(menuData)
        store.dispatch('permission/generateRoutes', { constRoutes }).then(() => {
          router.addRoute(store.getters.addRoutes)
          const redirect = decodeURIComponent(to.query.redirect as string || to.path)
          if(to.path === redirect) {
            next({
              ...to,
              replace: true
            })
          } else {
            next({
              path: redirect
            })
          }
        })
      }).catch(() => {
        store.dispatch('Logout').then(() => {
          next({
            path: '/login',
            query: {
              redirect: to.fullPath
            }
          })
        })
      })
    }
  }

  next()
})

router.afterEach(() => {
  window.$loadingBar.finish()
})

router.onError(() => {
  window.$loadingBar.error()
})
