import { ISettings } from '@/types/vite-env'
import defaultSettings from '@/settings'

const {
  globalTheme,
  sideOrHeaderTheme,
  themeEditor,
  menuMode,
  showTrigger,
  showLogo,
  tagsView,
  breadcrumb,
  fixedHeader,
  adminTitle,
  openConfig,
  breadcrumbIcon,
} = defaultSettings

export type TKey = keyof ISettings

export const useSettingsStore = defineStore('setting', {
  state:():ISettings => ({
    globalTheme,
    sideOrHeaderTheme,
    themeEditor,
    menuMode,
    showTrigger,
    showLogo,
    tagsView,
    breadcrumb,
    breadcrumbIcon,
    fixedHeader,
    adminTitle,
    openConfig,
  }),
  actions: {
    updateSetting({ key, value }: { key: TKey; value: string | boolean }) {
      console.log(key, value)
      if (this.$state.hasOwnProperty(key)) {
        ;(this.$state[key] as string | boolean) = value
      }
    },
    changeSetting(data: any) {
      this.updateSetting(data)
    },
  },
})