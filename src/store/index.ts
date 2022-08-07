import type { App } from 'vue'
import { createPinia } from 'pinia'
import type { TagView } from './types'
import { useUserStore } from './modules/user'
import {  useSettingStore} from './modules/setting'
import { usePermissionStore } from './modules/permission'
import { useTagsViewStore } from './modules/tagsView'

const store = createPinia()

export { useUserStore,useSettingStore,usePermissionStore,useTagsViewStore }

export { TagView }

export function setupStore(app: App<Element>) {
  app.use(store)
}
