import { computed, defineComponent, PropType, ref, toRaw, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NMenu } from 'naive-ui'
import { useRoutesMenu } from './use-routes-menu'
import { useUserStore } from '@/store'
import { isExternal } from '@/utils/validate'
import {IBaseTree} from "@/store/interface";
import { MenuOption } from 'naive-ui'

export default defineComponent({
  name: 'SideBar',
  props: {
    collapsed: {
      type: Boolean,
      default: true,
    },
    menuMode: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'vertical',
    },
    inverted: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const store = useUserStore()

    // 高亮菜单
    const activeKey = ref(route.meta.key)

    watch(
      () => route.fullPath,
      () => activeKey.value = route.meta.key
    )
    // 路由表
    const routes = computed(() => store.permissionList)
    //console.log(routes)
    // 菜单
    const menuOptions = useRoutesMenu(toRaw(routes.value))
    //console.log(menuOptions)
    // methods
    const handleClickItem = (key: string, item: any) => {
      if (isExternal(item.path)) {
        // 使用name做外链跳转
        return window.open(item.path)
      } else {
        return router.push({ path: item.path })
      }
    }

    return () => (
      <NMenu
        inverted={props.inverted}
        mode={props.menuMode}
        collapsed={props.collapsed}
        indent={20}
        collapsedWidth={64}
        collapsedIconSize={22}
        options={menuOptions}
        onUpdateValue={handleClickItem}
        v-model:value={activeKey.value}
      />
    )
  },
})
