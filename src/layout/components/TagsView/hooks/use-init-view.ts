import { usePermissionStore,useTagsViewStore } from '@/store'
import { computed, ComputedRef, nextTick, onMounted, ref, Ref, toRaw, watch } from 'vue'
import { RouteLocationNormalized, RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import { useFilterAffixTags } from './use-filter-affix-tags'

export function useInitView(selectedTag: any) {
  const route = useRoute()
  const router = useRouter()
  const permissionStore = usePermissionStore()
  const tagesViewStore = useTagsViewStore()

  // 固定的tag
  const affixTags: Ref<RouteRecordRaw[]> = ref([])

  /** computed */
  // 访问过的路由
  const visitedViews: ComputedRef<RouteLocationNormalized[]> = computed(
    () => tagesViewStore.visitedViews,
  )

  // routes
  const routes = computed(() => permissionStore.routes)

  // watch
  watch(
    () => route.path,
    () => {
      addTags()
    },
  )

  /** methods */
  // 加载固定tag
  const initTags = () => {
    affixTags.value = useFilterAffixTags(toRaw(routes.value))
    for (const tag of affixTags.value) {
      if (tag.name) {
        tagesViewStore.addVisitedView(tag)
      }
    }
  }
  // 添加访问的tag
  const addTags = () => {
    if (route.name) {
      tagesViewStore.addView(route)
    }
    return false
  }

  // 去当前tag
  const toCurrentTag = () => {
    nextTick(() => {
      for (const tag of selectedTag) {
        if (tag.to.path === route.path) {
          if (tag.to.fullPath !== route.fullPath) {
            tagesViewStore.updateVisitedView(route)
          }
          break
        }
      }
    })
  }
  // 去上一个 tag
  const toLastViews = (visitedViews: RouteLocationNormalized[], view: RouteLocationNormalized) => {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView) {
      router.push(latestView.fullPath)
    } else {
      if (view.name === 'Dashboard') {
        router.replace({ path: '/redirect' + view.fullPath })
      } else {
        router.push('/')
      }
    }
  }

  // 是否为活跃状态
  const isActive = (item: RouteLocationNormalized) => item.path === route.path

  // life
  onMounted(() => {
    initTags()
    addTags()
  })

  return {
    route,
    router,
    affixTags,
    visitedViews,
    tagesViewStore,
    permissionStore,
    addTags,
    toLastViews,
    isActive,
  }
}
