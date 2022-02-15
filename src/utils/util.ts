// 生成首页路由
import Layout from '@/layout/RouteView'
import InnerLink from '@/layout/components/InnerLink';
import {RouteRecordRaw} from "vue-router";
import { isURL } from "@/utils/validate";

export function generateIndexRouter(data: Array<any>) {
    let indexRouter: Array<RouteRecordRaw> = [{
        path: '/',
        name: 'dashboard',
        component: () => import('@/layout/index'),
        redirect: '/dashboard/analysis',
        children: [
            ...generateChildRouters(data)
        ]
    },{
        path: "/:pathMatch(.*)",
        redirect: "/404",
        meta: {
            hidden: true
        }
    }]
    return indexRouter;
}

// 生成嵌套路由（子路由）

function  generateChildRouters (data: Array<any>) {
    const modules = import.meta.glob('../views/*/*')
    const routers = [];
    for (let item of data) {
        // eslint-disable-next-line
        let URL = (item.info.url|| '').replace(/{{([^}}]+)?}}/g, (s1:any,s2:any) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
        if (isURL(URL)) {
            console.log(URL)
            item.info.url = URL;
        }

        let componentPath: any;
        if(item.info.component.indexOf("layout/RouterView") >= 0) {
            componentPath = Layout
        } else if(item.info.component.indexOf("layout/InnerLink") >= 0) {
            componentPath = InnerLink
        } else {
            componentPath = modules[`../views/${item.info.component}`]
        }
        //console.log(componentPath)
        let menu: RouteRecordRaw =  {
            path: item.info.url,
            name: item.info.name,
            redirect:item.info.redirect,
            component: componentPath,
            meta: {
                affix: item.info.name == '首页',
                key: item.key,
                title:item.info.name ,
                icon: item.info.icon,
                url:item.info.url ,
                permissionList:item.info.permissionList,
                keepAlive:item.info.keepAlive,
                internalOrExternal:item.info.internalOrExternal,
                componentName:item.info.componentName,
                hidden:item.info.hidden,
                alwaysShow: item.info.alwaysShow
            }
        }
        //console.log(menu)
        if(item.alwaysShow){
            menu.redirect = menu.path;
        }
        if (item.children && item.children.length > 0) {
            menu.children = [...generateChildRouters(item.children)];
        }
        //判断是否生成路由
        if(item.route && item.route === '0'){
            //console.log(' 不生成路由 item.route：  '+item.route);
            //console.log(' 不生成路由 item.path：  '+item.path);
        }else{
            routers.push(menu);
        }
    }
    return routers
}
