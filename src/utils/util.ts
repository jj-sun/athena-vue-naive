// 生成首页路由
import {RouteRecordRaw} from "vue-router";
import { isURL } from "@/utils/validate";

export function generateIndexRouter(data: Array<any>) {
    let indexRouter: Array<RouteRecordRaw> = [{
        path: '/',
        name: 'dashboard',
        component: () => import('@/layout/index'),
        meta: { title: '首页' },
        redirect: '/dashboard/index',
        children: [
            ...generateChildRouters(data)
        ]
    },{
        path: "*",
        redirect: "/404",
        meta: {
            hidden: true
        }
    }]
    return indexRouter;
}

// 生成嵌套路由（子路由）

function  generateChildRouters (data: Array<any>) {
    const routers = [];
    for (let item of data) {
        let component = "";
        if(item.component.indexOf("layouts")>=0){
            component = item.component;
        }else{
            component = "views/"+item.component;
        }

        // eslint-disable-next-line
        let URL = (item.info.url|| '').replace(/{{([^}}]+)?}}/g, (s1:any,s2:any) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
        if (isURL(URL)) {
            item.info.url = URL;
        }


        let menu: RouteRecordRaw =  {
            path: item.info.path,
            name: item.info.name,
            redirect:item.info.redirect,
            component: () => import(`@/${component}`),
            meta: {
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
