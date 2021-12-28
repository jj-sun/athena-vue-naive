import { axios, Method } from '@/utils/request'

const api = {
    user: '/mock/api/user',
    role: '/mock/api/role',
    service: '/mock/api/service',
    permission: '/mock/api/permission',
    permissionNoPager: '/mock/api/permission/no-pager'
}

export default api

//post
export function postAction(url: string, parameter: {}) {
   /* let sign = signMd5Utils.getSign(url, parameter);
    //将签名和时间戳，添加在请求接口 Header
    let signHeader = {"X-Sign": sign,"X-TIMESTAMP": signMd5Utils.getDateTimeToString()};*/
    return axios({
        url: url,
        method:'post' ,
        data: parameter
    })
}

//post method= {post | put}
export function httpAction(url: string,parameter: {},method: Method) {
   /* let sign = signMd5Utils.getSign(url, parameter);
    //将签名和时间戳，添加在请求接口 Header
    let signHeader = {"X-Sign": sign,"X-TIMESTAMP": signMd5Utils.getDateTimeToString()};*/

    return axios({
        url: url,
        method: method,
        data: parameter
    })
}

//put
export function putAction(url: string,parameter: {}) {
    return axios({
        url: url,
        method: 'put',
        data: parameter
    })
}

//get
export function getAction(url: string,parameter: {}) {
   /* let sign = signMd5Utils.getSign(url, parameter);
    //将签名和时间戳，添加在请求接口 Header
    let signHeader = {"X-Sign": sign,"X-TIMESTAMP": signMd5Utils.getDateTimeToString()};*/

    return axios({
        url: url,
        method: 'get',
        params: parameter
    })
}

//deleteAction
export function deleteAction(url: string,parameter: {}) {
    return axios({
        url: url,
        method: 'delete',
        params: parameter
    })
}

export function getUserList(parameter: {}) {
    return axios({
        url: api.user,
        method: 'get',
        params: parameter
    })
}

export function getRoleList(parameter: {}) {
    return axios({
        url: api.role,
        method: 'get',
        params: parameter
    })
}

export function getServiceList(parameter: {}) {
    return axios({
        url: api.service,
        method: 'get',
        params: parameter
    })
}

export function getPermissions(parameter: {}) {
    return axios({
        url: api.permissionNoPager,
        method: 'get',
        params: parameter
    })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFile(url: string,parameter: {}){
    return axios({
        url: url,
        params: parameter,
        method:'get' ,
        responseType: 'blob'
    })
}

/**
 * 下载文件
 * @param url 文件路径
 * @param fileName 文件名
 * @param parameter
 * @returns {*}
 */
export function downloadFile(url: string, fileName: string, parameter: {}) {
    return downFile(url, parameter).then((data: any) => {
        if (!data || data.size === 0) {
            window.$message.warning('文件下载失败')
            return
        }

        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) //下载完成移除元素
        window.URL.revokeObjectURL(url) //释放掉blob对象

    })
}

/**
 * 文件上传 用于富文本上传图片
 * @param url
 * @param parameter
 * @returns {*}
 */
export function uploadAction(url: string,parameter: {}){
    return axios({
        url: url,
        data: parameter,
        method:'post' ,
        headers: {
            'Content-Type': 'multipart/form-data',  // 文件上传
        },
    })
}

/**
 * 获取文件服务访问路径
 * @param avatar
 * @param subStr
 * @returns {*}
 */
export function getFileAccessHttpUrl(avatar: string,subStr: string) {
    if(!subStr) subStr = 'http'
    try {
        if(avatar && avatar.startsWith(subStr)){
            return avatar;
        }else{
            if(avatar &&　avatar.length>0 && avatar.indexOf('[')==-1){
                return window._CONFIG['staticDomainURL'] + "/" + avatar;
            }
        }
    }catch(err){
        return;
    }
}
