import Cookies from 'js-cookie'

export class Keys {
  static collapsedKey = 'Athena-collapsedKey'
  static tokenKey = 'Access-Token'
}

// collapsed
export const getCollapsed = () => Cookies.get(Keys.collapsedKey)
export const setCollapsed = (key: string) => Cookies.set(Keys.collapsedKey, key)

//1小时
let time = new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
// token
export const setToken = (token: string) => Cookies.set(Keys.tokenKey, token, { expires: time })
export const getToken = () => Cookies.get(Keys.tokenKey)
export const removeToken = () => Cookies.remove(Keys.tokenKey)

// [ ] emmmm 本来想把全局配置加到cookie记录，懒，就不加了
