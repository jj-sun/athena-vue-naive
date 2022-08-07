import { createApp } from 'vue'

// global less
import './styles/base.less'

import App from './App'

// router
import { router } from '@/router'

// 权限控制路由
import '@/permission'

// store
import { setupStore } from '@/store'

// 通用字体
import 'vfonts/Lato.css'

import { DashboardFilled } from '@vicons/antd'



function bootstrap() {
    const app = createApp(App)

     // 全局组件
    app.component('BlankLayout', () => import('@/layout/BlankLayout'))
    app.component('DashboardFilled', DashboardFilled)

    setupStore(app)

    app.use(router)

    app.mount('#app')
    
}

bootstrap()