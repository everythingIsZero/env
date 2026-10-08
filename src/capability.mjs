/**
 * capability.mjs — 能力位（零依赖纯函数）
 *
 * 消费方（auth/analytics/pwa/share）统一「按端分支」的判定入口，避免各自手写
 * `navigator.userAgent` 正则（现在 wordinput/fang 各写了一份 isWechatBrowser/isMobileBrowser）。
 *
 * 输入与 detect 同一套纯数据 signals；输出冻结的布尔能力位。
 */
import { normalizeFingerprint } from './detect.mjs'

const WECHAT_CONTAINERS = Object.freeze(['wechat', 'wechat-desktop', 'wechat-miniprogram-webview'])
const MOBILE_OSES = Object.freeze(['ios', 'android', 'harmony'])
const DESKTOP_OSES = Object.freeze(['macos', 'windows'])

/**
 * 由 signals 推导能力位。
 *
 * @param {{ ua?: string, maxTouchPoints?: number, hasStandaloneDisplayMode?: boolean, isMiniGame?: boolean }} [signals]
 * @returns {{
 *   isWechat: boolean, isWechatMobile: boolean, isDesktopWechat: boolean,
 *   isMiniprogram: boolean, isDouyin: boolean, isPwa: boolean,
 *   isMobile: boolean, isDesktop: boolean, isSmallGame: boolean
 * }}
 */
export function capabilities(signals) {
  const { fingerprint } = normalizeFingerprint(signals)
  const { container, os } = fingerprint
  const src = signals && typeof signals === 'object' ? signals : {}

  return Object.freeze({
    isWechat: WECHAT_CONTAINERS.includes(container),
    isWechatMobile: container === 'wechat',
    isDesktopWechat: container === 'wechat-desktop',
    isMiniprogram: container === 'wechat-miniprogram-webview',
    isDouyin: container === 'douyin',
    isPwa: container === 'pwa-standalone',
    isMobile: MOBILE_OSES.includes(os),
    isDesktop: DESKTOP_OSES.includes(os),
    isSmallGame: src.isMiniGame === true,
  })
}
