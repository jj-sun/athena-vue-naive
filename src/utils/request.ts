import axios, {AxiosResponse, Method} from 'axios'
import { useUserStore } from '@/store'
import VueAxios from 'vue-axios'
import { router } from '@/router/index'
import {getToken, removeToken} from "@/utils/cookies"
import {Ref} from "vue";
import {RouteLocationNormalizedLoaded} from "vue-router";

/**
 * 【指定 axios的 baseURL】
 * 如果手工指定 baseURL: '/athena'
 * 则映射后端域名，通过 vue.config.js
 * @type {*|string}
 */
//let apiBaseUrl = window._CONFIG['domianURL'] || "/athena";
let apiBaseUrl = '/athena'
// 创建 axios 实例
const service = axios.create({
    //baseURL: '/athena',
    baseURL: apiBaseUrl, // api base_url
    timeout: 9000 // 请求超时时间
})

const err = (error: any) => {
    if (error.response) {
        let data = error.response.data
        const token = getToken()
        const userStore = useUserStore()
        console.log("------异常响应------", token)
        console.log("------异常响应------", error.response.status)
        switch (error.response.status) {
            case 403:
                window.$notification.error({content: '系统提示', meta: '拒绝访问'})
                break
            case 500:
                console.log("------error.response------", error.response)
                // update-begin- --- author:liusq ------ date:20200910 ---- for:处理Blob情况----
                let type = error.response.request.responseType;
                if (type === 'blob') {
                    blobToJson(data);
                    break;
                }
                // update-end- --- author:liusq ------ date:20200910 ---- for:处理Blob情况----
                if (token && data.message.includes("Token失效")) {
                    // update-begin- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
                    if (/wxwork|dingtalk/i.test(navigator.userAgent)) {
                        window.$message.loading('登录已过期，正在重新登陆', {duration: 0})
                        removeToken()
                        window.location.reload()
                    } else {
                        window.$dialog.error({
                            title: '登录已过期',
                            content: '很抱歉，登录已过期，请重新登录',
                            positiveText: '重新登录',
                            onPositiveClick: () => {
                                userStore.logout().then(() => {
                                    removeToken()
                                    try {
                                        let path = window.document.location.pathname
                                        console.log('location pathname -> ' + path)
                                        if (path != '/' && path.indexOf('/user/login') == -1) {
                                            window.location.reload()
                                        }
                                    } catch (e) {
                                        window.location.reload()
                                    }
                                })
                            }
                        })
                    }
                    // update-end- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
                }
                break
            case 404:
                window.$notification.error({content: '系统提示', meta: '很抱歉，资源未找到!', duration: 4000})
                break
            case 504:
                window.$notification.error({content: '系统提示', meta: '网络超时'})
                break
            case 401:
                window.$notification.error({content: '系统提示', meta: '未授权，请重新登录', duration: 4000})
                if (token) {
                    userStore.logout().then(() => {
                        setTimeout(() => {
                            window.location.reload()
                        }, 1500)
                    })
                }
                break
            default:
                window.$notification.error({
                    content: '系统提示',
                    meta: data.message,
                    duration: 4000
                })
                break
        }
    } else if (error.message) {
        if (error.message.includes('timeout')) {
            window.$notification.error({content: '系统提示', meta: '网络超时'})
        } else {
            window.$notification.error({content: '系统提示', meta: error.message})
        }
    }
    return Promise.reject(error)
};

// request interceptor
service.interceptors.request.use((config: any) => {
    const token = getToken()
    if (token) {
        config.headers['X-Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    }

    // update-begin--author:sunjianlei---date:20200723---for 如果当前在low-app环境，并且携带了appId，就向Header里传递appId
    let $route: Ref<RouteLocationNormalizedLoaded> = router.currentRoute
    if ($route && $route.value && $route.value.name && $route.value.name.toString().startsWith('low-app') && $route.value.params.appId) {
        config.headers['X-Low-App-ID'] = $route.value.params.appId
    }
    // update-end--author:sunjianlei---date:20200723---for 如果当前在low-app环境，并且携带了appId，就向Header里传递appId

    if (config.method == 'get') {
        if (config.url.indexOf("sys/dict/getDictItems") < 0) {
            config.params = {
                _t: Date.now() / 1000,
                ...config.params
            }
        }
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use((response: AxiosResponse) => {
    return response.data
}, err)

const installer = {
    vm: {},
    install(Vue: any, router = {}) {
        Vue.use(VueAxios, router, service)
    }
}

/**
 * Blob解析
 * @param data
 */
function blobToJson(data: any) {
    let fileReader = new FileReader();
    let token = getToken()
    const userStore = useUserStore()
    fileReader.onload = function () {
        try {
            let jsonData = JSON.parse(data);  // 说明是普通对象数据，后台转换失败
            if (jsonData.status === 500) {
                if (token && jsonData.message.includes("Token失效")) {
                    window.$dialog.error({
                        title: '登录已过期',
                        content: '很抱歉，登录已过期，请重新登录',
                        positiveText: '重新登录',
                        onPositiveClick: () => {
                            userStore.logout().then(() => {
                                removeToken()
                                window.location.reload()
                            })
                        }
                    })
                }
            }
        } catch (err) {
            // 解析成对象失败，说明是正常的文件流
            console.log("blob解析fileReader返回err", err)
        }
    };
    fileReader.readAsText(data)
}

export {
    installer as VueAxios,
    service as axios,
    Method
}
