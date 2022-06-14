import type { App } from 'vue'
import { createPinia } from 'pinia'
import { useUserStore } from './modules/user'
import {  useSettingsStore} from './modules/settings'
import { useAppStore } from './modules/app'
import { usePermissionStore } from './modules/permission'
import { useTagsViewStore } from './modules/tagsView'

const store = createPinia()

export { useUserStore,useSettingsStore,useAppStore,usePermissionStore,useTagsViewStore }

export function setupStore(app: App<Element>) {
  app.use(store)
}
