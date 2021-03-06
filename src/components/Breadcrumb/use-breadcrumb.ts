import { RouteRecordRaw } from 'vue-router'
import { MenuOption } from 'naive-ui'
import { AimOutlined } from '@vicons/antd'
import { renderIcon } from '@/utils'
import * as antd from '@vicons/antd'

/**
 * 返回面包屑所用菜单格式
 * @param {routes} RouteRecordRaw[] 传入的路由
 * @returns 返回适应的菜单
 */
export function useBreadcrumb(routes: RouteRecordRaw[]) {
  //console.log(routes)
  return routes.map(route => {
    // if (route.children?.length === 1) {
    //   route = route.children[0]
    // }
    const currentMenu: MenuOption = {
      label: route.meta?.title,
      key: route.name as string,
      icon: renderIcon(antd[route.meta?.icon] || AimOutlined),
      disabled: route.path === '/',
    }

    if (route.children && route.children.length > 0) {
      currentMenu.children = useBreadcrumb(route.children)
    }

    return currentMenu
  })
}
