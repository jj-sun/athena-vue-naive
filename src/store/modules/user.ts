import { getToken, setToken } from '@/utils/cookies';
import { UserState } from '../interface'
import { login, logout, queryPermissionsByUser } from "@/api/login"
import { router } from "@/router"
import { USER_NAME, USER_INFO } from '@/store/mutation-types'

export const useUserStore = defineStore ('user', {
  state: (): UserState => ({
    token: getToken(),
    username: '',
    realname: '',
    avatar: '',
    info: {},
    permissionList: [],
    roles: [],
  }),
  getters: {
    userInfo(state: UserState): UserState {
      return { ...state }
    }
  },
  actions: {
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial)
    },
    login(userInfo: any) {
      console.log(userInfo)
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({ username, password })
          .then((res: any) => {
            let result: any = res.result
           
            this.setInfo({
              token: result.token,
              info: result.info,
              username: result.userInfo.username,
              realname: result.userInfo.realname,
              avatar: result.userInfo.avatar
            })

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
    GetPermissionList() {
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
            
            this.permissionList = menuData
          } else {
            reject('getPermissionList: permissions must be a non-null array !')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    logout() {
      return new Promise((resolve => {
        let logoutToken: any = this.token
        
        this.setInfo({
          token: '',
          info: {},
          username: '',
          realname: '',
          avatar: '',
          permissionList: []
        })

        setToken('')
        localStorage.removeItem(USER_NAME)
        localStorage.removeItem(USER_INFO)
        logout(logoutToken).then(() => {
          router.replace('/login')
          window.location.reload()
        }).catch(() => {

        })
      }))
    }
  },
})
