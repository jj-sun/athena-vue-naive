import { createApp } from 'vue'
import App from './App'

// router
import router from '@/router'

// 权限控制路由
import '@/permission'

// store
import { setupStore } from '@/store'

// 通用字体
import 'vfonts/Lato.css'

const app = createApp(App)

setupStore(app)
app.use(router)

app.mount('#app')

const win: any = window
if(process.env.NODE_ENV === 'development') {
    if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in win) {
        win.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app
    }
}
