import { renderIcon } from '@/utils'
import { NMenu } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import type { Component, PropType } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import type { MenuMode } from '@/settings'
import * as antd from '@vicons/antd'

const Menu = defineComponent({
  name: 'Menu',
  props: {
    isInverted: Boolean,
    collapsedWidth: Number,
    collapsedIconSize: Number,
    menuMode: {
      type: String as PropType<MenuMode>,
      default: 'vertical'
    }
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()

    // 高亮菜单
    let activeKey = $ref(route.meta.key)
    watch(
      () => route.fullPath,
      () => {
        activeKey = route.meta.key as string
      }
    )

    console.log(activeKey)

    const handleClickItem = (key: string) => {
      return router.push({ name: key })
    }

    // root menu
    const appRoute = $computed(() =>
      router.getRoutes().find((route) => route.name === 'root')
      //permissionSotre.routes
    )
    console.log(appRoute)

    const menuTree = $computed(() => {
      // const copyRoutes = JSON.parse(JSON.stringify(appRoute?.children))
      const copyRoutes = [...appRoute!.children]
      //const copyRoutes = permissionSotre.routes

      function travel(routes: RouteRecordRaw[], layer: number) {
        return routes.map((route) => {
          if (route.children) {
            route.children = travel(route.children, layer + 1)
          }
          return {
            ...route,
            label: route.meta?.title,
            icon:
              typeof route.meta?.icon === 'string'
                ? renderIcon(antd[route.meta?.icon] as Component)
                : renderIcon(route.meta?.icon as unknown as Component),
            key: route.meta?.key
          }
        })
      }
      return travel(copyRoutes, 0)
    })

    console.log(menuTree)

    return () => (
      <NMenu
        mode={props.menuMode}
        indent={20}
        accordion
        collapsedWidth={props.collapsedWidth}
        collapsedIconSize={props.collapsedIconSize}
        options={menuTree as MenuOption[]}
        onUpdateValue={handleClickItem}
        inverted={props.isInverted}
        v-model:value={activeKey}
        style={{ zIndex: 1 }}
      ></NMenu>
    )
  }
})

export default Menu
