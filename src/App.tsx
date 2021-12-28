import { defineComponent } from 'vue'
import { darkTheme, NConfigProvider, NThemeEditor, dateZhCN, zhCN } from 'naive-ui'
import { RouterView } from 'vue-router'
import GlobalProvider from './components/GlobalProvider'
import GlobalInject from './components/GlobalProvider/GlobalInject'
import '@/styles/index.less'
import { useSettings } from './hooks/use-settings'

export default defineComponent({
    name: 'App',
    setup() {
        const { globalTheme, themeEditor } = useSettings()

        return () => (
            <NConfigProvider
                theme={globalTheme.value === 'darkTheme' ? darkTheme : undefined}
                locale={zhCN}
                dateLocale={dateZhCN}>
                <GlobalProvider>
                    <GlobalInject>
                        {themeEditor.value ? (
                            <NThemeEditor>
                                <RouterView />
                            </NThemeEditor>
                        ) : (
                            <RouterView />
                        )}
                    </GlobalInject>
                </GlobalProvider>
            </NConfigProvider>
        )
    },
})
