import { computed } from 'vue'
import { useSettingsStore } from '@/store'

export function useSettings() {
  const store = useSettingsStore()

  return {
    globalTheme: computed(() => store.globalTheme),
    sideOrHeaderTheme: computed(() => store.sideOrHeaderTheme),
    themeEditor: computed(() => store.themeEditor),
    menuMode: computed(() => store.menuMode),
    showTrigger: computed(() => store.showTrigger),
    showLogo: computed(() => store.showLogo),
    tagsView: computed(() => store.tagsView),
    breadcrumb: computed(() => store.breadcrumb),
    breadcrumbIcon: computed(() => store.breadcrumbIcon),
    fixedHeader: computed(() => store.fixedHeader),
    adminTitle: computed(() => store.adminTitle),
    openConfig: computed(() => store.openConfig),
  }
}
