import { TagsViewState } from '../interface'

export const useTagsViewStore = defineStore('tagsView', {
  state: (): TagsViewState => ({
    // 访问过的
    visitedViews: [],
    // 缓存的
    cachedViews: [],
  }),
  // mutations: {
  //   ADD_VISITED_VIEW: (state, view) => {
  //     if (state.visitedViews.some(v => v.path === view.path)) return
  //     state.visitedViews.push(
  //       Object.assign({}, view, {
  //         title: view.meta.title || 'no-name',
  //       }),
  //     )
  //   },
  //   ADD_CACHED_VIEW: (state, view) => {
  //     if (state.cachedViews.includes(view.name)) return
  //     if (!view.meta.noCache) {
  //       state.cachedViews.push(view.name)
  //     }
  //   },
  //   DEL_VISITED_VIEW: (state, view) => {
  //     for (const [i, v] of state.visitedViews.entries()) {
  //       if (v.path === view.path) {
  //         state.visitedViews.splice(i, 1)
  //         break
  //       }
  //     }
  //   },
  //   DEL_CACHED_VIEW: (state, view) => {
  //     const index = state.cachedViews.indexOf(view.name)
  //     index > -1 && state.cachedViews.splice(index, 1)
  //   },

  //   DEL_OTHERS_VISITED_VIEWS: (state, view) => {
  //     state.visitedViews = state.visitedViews.filter(v => {
  //       return v.meta.affix || v.path === view.path
  //     })
  //   },
  //   DEL_OTHERS_CACHED_VIEWS: (state, view) => {
  //     const index = state.cachedViews.indexOf(view.name)
  //     if (index > -1) {
  //       state.cachedViews = state.cachedViews.slice(index, index + 1)
  //     } else {
  //       // 没有缓存的组件
  //       state.cachedViews = []
  //     }
  //   },

  //   DEL_ALL_VISITED_VIEWS: state => {
  //     // 固定的tags
  //     const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
  //     state.visitedViews = affixTags
  //   },
  //   DEL_ALL_CACHED_VIEWS: state => {
  //     state.cachedViews = []
  //   },

  //   UPDATE_VISITED_VIEW: (state, view) => {
  //     for (let v of state.visitedViews) {
  //       if (v.path === view.path) {
  //         v = Object.assign(v, view)
  //         break
  //       }
  //     }
  //   },
  // },
  actions: {
    // 添加 view 缓存和访问
    addView(view) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },
    // 访问过的
    addVisitedView(view) {
      this.ADD_VISITED_VIEW(view)
    },
    // 缓存的
    addCachedView(view) {
      this.ADD_CACHED_VIEW(view)
    },

    // 删除
    delView(view) {
      return new Promise(resolve => {
        this.delVisitedView(view)
        this.delCachedView(view)
      
        resolve({
          visitedViews: [...this.$state.visitedViews],
          cachedViews: [...this.$state.cachedViews],
        })
      })
    },
    // 删除访问过的
    delVisitedView(view) {
      return new Promise(resolve => {
        this.DEL_VISITED_VIEW(view)
        resolve([...this.$state.visitedViews])
      })
    },
    // 删除缓存的
    delCachedView(view) {
      return new Promise(resolve => {
        this.DEL_CACHED_VIEW(view)
        resolve([...this.$state.cachedViews])
      })
    },

    // 删除其他
    delOthersViews(view) {
      return new Promise(resolve => {
        this.delOthersVisitedViews(view)
        this.delOthersCachedViews(view)
        resolve({
          visitedViews: [...this.$state.visitedViews],
          cachedViews: [...this.$state.cachedViews],
        })
      })
    },
    // 删除其他访问
    delOthersVisitedViews(view) {
      return new Promise(resolve => {
        this.DEL_OTHERS_VISITED_VIEWS(view)
        resolve([...this.$state.visitedViews])
      })
    },
    // 删除其他缓存
    delOthersCachedViews(view) {
      return new Promise(resolve => {
        this.DEL_OTHERS_CACHED_VIEWS(view)
        resolve([...this.$state.cachedViews])
      })
    },

    // 删除所有
    delAllViews(view) {
      return new Promise(resolve => {
        this.delAllVisitedViews(view)
        this.delAllCachedViews(view)
        resolve({
          visitedViews: [...this.$state.visitedViews],
          cachedViews: [...this.$state.cachedViews],
        })
      })
    },
    delAllVisitedViews() {
      return new Promise(resolve => {
        this.DEL_ALL_VISITED_VIEWS()
        resolve([...this.$state.visitedViews])
      })
    },
    delAllCachedViews() {
      return new Promise(resolve => {
        this.DEL_ALL_CACHED_VIEWS()
        resolve([...this.$state.cachedViews])
      })
    },

    // 更新访问
    updateVisitedView(view) {
      this.UPDATE_VISITED_VIEW(view)
    },

    ADD_VISITED_VIEW(view) {
      if (this.$state.visitedViews.some(v => v.path === view.path)) return
      this.$state.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta.title || 'no-name',
        }),
      )
    },
    ADD_CACHED_VIEW (view){
      if (this.$state.cachedViews.includes(view.name)) return
      if (!view.meta.noCache) {
        this.$state.cachedViews.push(view.name)
      }
    },
    DEL_VISITED_VIEW(view) {
      for (const [i, v] of this.$state.visitedViews.entries()) {
        if (v.path === view.path) {
          this.$state.visitedViews.splice(i, 1)
          break
        }
      }
    },
    DEL_CACHED_VIEW(view) {
      const index = this.$state.cachedViews.indexOf(view.name)
      index > -1 && this.$state.cachedViews.splice(index, 1)
    },

    DEL_OTHERS_VISITED_VIEWS(view) {
      this.$state.visitedViews = this.$state.visitedViews.filter(v => {
        return v.meta.affix || v.path === view.path
      })
    },
    DEL_OTHERS_CACHED_VIEWS (view) {
      const index = this.$state.cachedViews.indexOf(view.name)
      if (index > -1) {
        this.$state.cachedViews = this.$state.cachedViews.slice(index, index + 1)
      } else {
        // 没有缓存的组件
        this.$state.cachedViews = []
      }
    },

    DEL_ALL_VISITED_VIEWS(){
      // 固定的tags
      const affixTags = this.$state.visitedViews.filter(tag => tag.meta.affix)
      this.$state.visitedViews = affixTags
    },
    DEL_ALL_CACHED_VIEWS() {
      this.$state.cachedViews = []
    },

    UPDATE_VISITED_VIEW(view) {
      for (let v of this.$state.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    },
  },
})

