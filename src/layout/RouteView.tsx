import { computed, defineComponent, KeepAlive, Transition } from 'vue'
import { RouteLocationNormalizedLoaded, RouterView, useRoute } from 'vue-router'
import { useTagsViewStore } from '@/store'

export default defineComponent({
    name: 'RouterView',
    setup() {
        const store = useTagsViewStore()
        const route = useRoute()

        const cachedViews = computed(() => store.cachedViews)
        const key = computed(() => route.path)
        return () => {
            return (
                <div>
                    <RouterView>
                        {{
                            default: (
                                { Component }: { Component: () => JSX.Element },
                                route: RouteLocationNormalizedLoaded,
                            ) => {
                                return (
                                    <Transition name="fade-transform" mode="out-in">
                                        <KeepAlive include={cachedViews.value as unknown as string[]}>
                                            <Component key={key.value} />
                                            {/* <Component key={route.path} /> */}
                                        </KeepAlive>
                                    </Transition>
                                )
                            },
                        }}
                    </RouterView>
                </div>
            )
        }
    }
})
