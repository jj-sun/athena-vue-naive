import { ISettings } from '@/types/vite-env'
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

export interface IRootState {
  app: AppState
  permission: PermissState
  tagsView: TagsViewState
  settings: ISettings
  user: UserState
}

export interface AppState {
  collapsed: boolean
  showDrawer: boolean,
  device: string
  size: string
}

export interface PermissState {
  routes: RouteRecordRaw[]
  addRoutes: RouteRecordRaw[]
}

export interface TagsViewState {
  visitedViews: RouteLocationNormalized[]
  cachedViews: RouteLocationNormalized[]
}

export interface UserState {
  token: string | undefined
  username: string,
  realname: string,
  avatar: string,
  info: {},
  permissionList: Array<IBaseTree>,
  roles: string[]
}

export interface IBaseTree {
  info: any,
  key: string,
  parentKey: string,
  label: string,
  disabled: boolean,
  children: Array<IBaseTree>
}
