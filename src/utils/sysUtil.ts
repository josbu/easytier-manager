import { arch, hostname, platform, type } from '@tauri-apps/plugin-os'
import { locale } from '@tauri-apps/plugin-os'
import { getCurrentWindow } from '@tauri-apps/api/window'
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
  type Options
} from '@tauri-apps/plugin-notification'
import { getVersion } from '@tauri-apps/api/app'

/**
 * 操作系统平台
 * @returns platform 返回一个描述使用的特定操作系统的字符串。该值在编译时设置。
 * 可能的值有 linux、macos、ios、freebsd、dragonfly、netbsd、openbsd、solaris、android、windows
 */
export const getPlatform = () => {
  const currentPlatform = platform()
  return currentPlatform
}

/**
 * 操作系统类型
 * @returns 返回一个描述使用的特定操作系统的字符串。该值在编译时设置。
 * 可能的值有 `'linux'` on Linux, `'macos'` on macOS, `'windows'` on Windows, `'ios'` on iOS and `'android'` on Android.
 */
export const getOsType = () => {
  const currentOsType = type()
  return currentOsType
}

/**
 * 获取系统架构
 * @returns 返回一个描述系统架构的字符串。该值在编译时设置。
 * 可能的值有 `'x86'`, `'x86_64'`, `'arm'`, `'aarch64'`, `'mips'`, `'mips64'`, `'powerpc'`, `'powerpc64'`, `'riscv64'`, `'s390x'`, `'sparc64'`.
 */
export const getArch = () => {
  const currentArch = arch()
  return currentArch
}
/**
 * 获取系统名
 * @returns 返回当前系统名
 */
export const getHostname = async () => {
  const currentHostname = await hostname()
  return currentHostname
}
/**
 * 获取当前系统语言
 * @returns 返回当前系统语言
 */
export const getLocale = async () => {
  const currentLocale = await locale()
  console.log(currentLocale)
  if (currentLocale) {
    // use the locale string here
  }
  return currentLocale
}

// 处理窗口关闭事件
export const handleWindowClose = async () => {
  const window = getCurrentWindow()

  // 监听窗口关闭事件
  await window.onCloseRequested(async (event) => {
    // 阻止默认关闭行为
    event.preventDefault()

    // 询问用户是否最小化到托盘
    // const shouldMinimize = await ask('是否最小化到托盘？', {
    //   title: '关闭提示',
    //   type: 'warning'
    // })

    await window.minimize()
    // if (shouldMinimize) {
    //   // 最小化窗口
    // } else {
    //   // 用户选择退出，调用托盘的退出方法
    //   await trayStore.onQuit()
    // }
  })
}

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const notify = async (
  body: string,
  title: string = 'EasyTier 管理器',
  options?: Options
) => {
  // 通知权限
  let permissionGranted = await isPermissionGranted()

  // 如果没有，我们需要请求它
  if (!permissionGranted) {
    const permission = await requestPermission()
    permissionGranted = permission === 'granted'
  }

  // 一旦获得许可，我们就可以发送通知
  if (permissionGranted) {
    sendNotification({ title, body, silent: true, ...options })
  }
}

/**
 * 获取当前App的版本
 */
export const getAppVersion = async () => {
  const appVersion = await getVersion()
  return appVersion
}
