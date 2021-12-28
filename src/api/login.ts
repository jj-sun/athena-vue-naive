import { axios } from '@/utils/request'
import exp from "constants";
const api = {
    Login: '/login',
    Logout: '/logout',
    ForgePassword: '/auth/forge-password',
    Register: '/auth/register',
    UserInfo: '/user/info',
    GetPermissions: 'sys/permission/nav'
}

export function login(parameter: {}) {
    return axios({
        url: api.Login,
        method: 'post',
        params: parameter
    })
}

export function logout(logoutToken: string) {
    return axios({
        url: api.Logout,
        method: 'get',
        headers: {
            'X-Access-Token': logoutToken
        }
    })
}

export function queryPermissionsByUser() {
    return axios({
        url: api.GetPermissions,
        method: 'get',

    })
}
