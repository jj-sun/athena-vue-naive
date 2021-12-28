import { ISettings } from '@/types/vite-env'
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

export interface IRootState {
  app: IAppState
  permission: IPermissState
  tagsView: ITagsViewState
  settings: ISettings
  user: IUserState
}

export interface IAppState {
  collapsed: boolean
  device: string
  size: string
}

export interface IPermissState {
  routes: RouteRecordRaw[]
  addRoutes: RouteRecordRaw[]
}

export interface ITagsViewState {
  visitedViews: RouteLocationNormalized[]
  cachedViews: RouteLocationNormalized[]
}

export interface IUserState {
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
