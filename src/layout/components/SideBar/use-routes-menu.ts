import { renderIcon } from '@/utils'
import * as antd from '@vicons/antd'
import { VNode } from 'vue'
import { MenuOption } from 'naive-ui'
import { IBaseTree } from "@/store/interface";

export function useRoutesMenu(routerMap: Array<IBaseTree>) {
  return routerMap
    .filter(item => {
      return item.info.hidden != true
    })
    // renderIcon((item.info?.icon as VNode) || AimOutlined)
    .map(item => {
      const currentMenu: MenuOption = {
        label: item.label,
        key: item.key,
        icon: renderIcon(antd[item.info?.icon] || antd['AimOutlined']),
        path: item.info.url
      }
      // 是否有子菜单，并递归处理
      if (item.children && item.children.length > 0) {
        // Recursion
        currentMenu.children = useRoutesMenu(item.children)
      }
      return currentMenu
    })
}
