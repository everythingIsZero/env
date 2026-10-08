/**
 * capability.test.mjs — 能力位（node:test，零依赖纯函数）
 * 能力位由指纹 + 显式信号推导，供 auth/analytics 等消费方统一「按端分支」。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { capabilities } from '../src/index.mjs'

const IPHONE_WX =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003128) NetType/WIFI Language/zh_CN'
const DESKTOP_WX_WIN =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/3.9.10.19(0x28000129) WindowsWechat(0x63090a13)'
const MINIPROGRAM = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 MicroMessenger/8.0.49 miniProgram'
const DOUYIN = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 aweme/26.9.0'
const ANDROID_CHROME =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36'
const MAC_DESKTOP =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15'

test('微信移动内：isWechat 与 isWechatMobile 真、桌面微信假', () => {
  const c = capabilities({ ua: IPHONE_WX })
  assert.equal(c.isWechat, true)
  assert.equal(c.isWechatMobile, true)
  assert.equal(c.isDesktopWechat, false)
  assert.equal(c.isMobile, true)
  assert.equal(c.isDesktop, false)
})

test('桌面微信：isDesktopWechat 真、isWechatMobile 假、判桌面', () => {
  const c = capabilities({ ua: DESKTOP_WX_WIN })
  assert.equal(c.isDesktopWechat, true)
  assert.equal(c.isWechat, true)
  assert.equal(c.isWechatMobile, false)
  assert.equal(c.isMobile, false)
  assert.equal(c.isDesktop, true)
})

test('小程序 webview 与抖音分别识别', () => {
  assert.equal(capabilities({ ua: MINIPROGRAM }).isMiniprogram, true)
  assert.equal(capabilities({ ua: DOUYIN }).isDouyin, true)
  assert.equal(capabilities({ ua: DOUYIN }).isWechat, false)
})

test('PWA 独立显示模式（显式信号）', () => {
  assert.equal(capabilities({ ua: ANDROID_CHROME, hasStandaloneDisplayMode: true }).isPwa, true)
  assert.equal(capabilities({ ua: ANDROID_CHROME }).isPwa, false)
})

test('Android 手机浏览器判移动；Mac 桌面判桌面', () => {
  assert.equal(capabilities({ ua: ANDROID_CHROME }).isMobile, true)
  assert.equal(capabilities({ ua: ANDROID_CHROME }).isDesktop, false)
  assert.equal(capabilities({ ua: MAC_DESKTOP, maxTouchPoints: 0 }).isDesktop, true)
  assert.equal(capabilities({ ua: MAC_DESKTOP, maxTouchPoints: 0 }).isMobile, false)
})

test('小游戏：无 UA 能力，由显式信号 isMiniGame 判定', () => {
  assert.equal(capabilities({ isMiniGame: true }).isSmallGame, true)
  assert.equal(capabilities({}).isSmallGame, false)
})

test('capabilities 返回冻结对象，未知输入不抛错', () => {
  const c = capabilities(undefined)
  assert.equal(c.isWechat, false)
  assert.ok(Object.isFrozen(c))
})
