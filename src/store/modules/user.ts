import { getToken, setToken } from '@/utils/cookies'
import { Module } from 'vuex'
import { IRootState, IUserState } from '../interface'
import { login, logout, queryPermissionsByUser } from "@/api/login"
import router from "@/router"
import { USER_NAME, USER_INFO } from '@/store/mutation-types'

const userModule: Module<IUserState, IRootState> = {
  namespaced: true,
  state: {
    token: getToken(),
    username: '',
    realname: '',
    avatar: '',
    info: {},
    permissionList: [],
    roles: [],
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { username, realname }) => {
      state.username = username
      state.realname = realname
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
  },
  actions: {
    login({ commit }, userInfo) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ username, password })
          .then((res: any) => {
            let result: any = res.result
            commit('SET_TOKEN', result.token)
            commit('SET_INFO', result.userInfo)
            commit('SET_NAME', {
              username: result.userInfo.username,
              realname: result.userInfo.realname
            })
            commit('SET_AVATAR', result.userInfo.avatar)
            setToken(result.token)
            localStorage.setItem(USER_NAME, result.userInfo.username)
            localStorage.setItem(USER_INFO, JSON.stringify(result.userInfo))
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    GetPermissionList({
                        commit
                      }) {
      return new Promise((resolve, reject) => {
        queryPermissionsByUser().then((response: any) => {
          const menuData = response.result.menuTree;
          const authData = response.result.permissions;
          const allAuthData = response.result.allAuth;
          //Vue.ls.set(USER_AUTH,authData);
          /*sessionStorage.setItem(USER_AUTH, JSON.stringify(authData));
          sessionStorage.setItem(SYS_BUTTON_AUTH, JSON.stringify(allAuthData));*/
          if (menuData && menuData.length > 0) {
            //update--begin--autor:qinfeng-----date:20200109------for：JEECG-63 一级菜单的子菜单全部是隐藏路由，则一级菜单不显示------
            /*menuData.forEach((item, index) => {
              if (item["children"]) {
                let hasChildrenMenu = item["children"].filter((i) => {
                  return !i.hidden || i.hidden == false
                })
                if (hasChildrenMenu == null || hasChildrenMenu.length == 0) {
                  item["hidden"] = true
                }
              }
            })*/
            //console.log(" menu show json ", menuData)
            //update--end--autor:qinfeng-----date:20200109------for：JEECG-63 一级菜单的子菜单全部是隐藏路由，则一级菜单不显示------
            commit('SET_PERMISSIONLIST', menuData)
          } else {
            reject('getPermissionList: permissions must be a non-null array !')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    logout({ commit, state }) {
      return new Promise((resolve => {
        let logoutToken: any = state.token
        commit('SET_TOKEN', '')
        commit('SET_INFO', {})
        commit('SET_NAME', {
          username: '',
          realname: ''
        })
        commit('SET_AVATAR', '')
        commit('SET_PERMISSIONLIST', [])

        setToken('')
        localStorage.removeItem(USER_NAME)
        localStorage.removeItem(USER_INFO)
        logout(logoutToken).then(() => {
          router.replace('/login')
        }).catch(() => {

        })
      }))
    }
  },
}

export default userModule
