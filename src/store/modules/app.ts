import { AppState } from '../interface'

export const useAppStore = defineStore('app',{
  state: (): AppState => ({
    collapsed: false,
    showDrawer: false,
    device: 'desktop',
    size: 'medium',
  }),
  actions: {
    updateSettings(partial: Partial<AppState>) {
      this.$patch(partial)
    },
    toggleCollapsed() {
      return this.collapsed = !this.collapsed
    }
  },
})
