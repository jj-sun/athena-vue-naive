import { renderIcon } from '@/utils'
import { AimOutlined } from '@vicons/antd'
import { VNode } from 'vue'
import { MenuOption } from 'naive-ui'
import { IBaseTree } from "@/store/interface";

export function useRoutesMenu(routerMap: Array<IBaseTree>) {
  return routerMap
    .filter(item => {
      return item.info.hidden != true
    })
    .map(item => {
      if (item.children?.length === 1) {
        item = item.children[0]
      }
      const currentMenu: MenuOption = {
        label: item.label,
        key: item.key,
        icon: renderIcon((item.info?.icon as VNode) || AimOutlined),
      }
      // 是否有子菜单，并递归处理
      if (item.children && item.children.length > 0) {
        // Recursion
        currentMenu.children = useRoutesMenu(item.children)
      }
      return currentMenu
    })
}
