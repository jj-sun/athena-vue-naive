import { useTitle } from '@vueuse/core'
import { router } from '@/router'
import { useUserStore,usePermissionStore } from '@/store'
import { getToken } from "@/utils/cookies"
import { generateIndexRouter } from "@/utils/util";
import {RouteRecordRaw} from "vue-router";

const title = useTitle()

// 白名单
const whiteList = ['/login', '/auth-redirect']

router.beforeEach( (to, from, next) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  // 开启加载条
  window.$loadingBar.start()
  //console.log(router.getRoutes())
  // 动态标题栏
  title.value = `后台管理-ATHENA`
  if(getToken()) {
    if(to.path === '/login') {
      next({
        path: '/dashboard/analysis'
      })
      window.$loadingBar.finish()
    } else {
      if(userStore.permissionList.length === 0) {
        userStore.GetPermissionList().then((res: any) => {
          const menuData = res.result.menuTree
          if(menuData === null || menuData === undefined) {
            return
          }
          let constRoutes = generateIndexRouter(menuData)
          console.log(constRoutes)
          // @ts-ignore
          permissionStore.generateRoutes({ constRoutes }).then((data: Array<RouteRecordRaw>) => {
            data.forEach(item => {
              router.addRoute(item)
            })
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
        }).catch((e) => {
          userStore.logout().then(() => {
            next({
              path: '/login',
              query: {
                redirect: to.fullPath
              }
            })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if(whiteList.indexOf(to.path) !== -1 ) {
      next()
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  }
})

router.afterEach(() => {
  window.$loadingBar.finish()
})

router.onError(() => {
  window.$loadingBar.error()
})
