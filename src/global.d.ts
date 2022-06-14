import { DialogApi, LoadingBarApi, MessageApi, NotificationApi } from 'naive-ui'

declare global {
  interface Window {
    $message: MessageApi
    $dialog: DialogApi
    $loadingBar: LoadingBarApi
    $notification: NotificationApi,
  }
  interface Result<T> {
    code: number,
    message: string,
    success: boolean,
    result: T,
    timestamp: number
  }
  interface BaseModel {
    id: string,
    creator: string,
    ctime: string,
    delFlag: number,
    editor: string,
    mtime: string,
  }
}