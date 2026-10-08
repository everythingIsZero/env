/**
 * detect.test.mjs — UA 指纹归一（node:test，零依赖纯函数）
 * 语义对齐 share-kit/core/probe.mjs（本包为其收敛目标；share-kit forward-only 后再切依赖）。
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  CONTAINER_VALUES,
  OS_VALUES,
  ENGINE_VALUES,
  detectContainer,
  detectOs,
  detectEngine,
  detectVersionBand,
  normalizeFingerprint,
} from '../src/index.mjs'

const IPHONE_WX =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.49(0x18003128) NetType/WIFI Language/zh_CN'
const DESKTOP_WX_WIN =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 MicroMessenger/3.9.10.19(0x28000129) WindowsWechat(0x63090a13)'
const MINIPROGRAM = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 MicroMessenger/8.0.49 miniProgram'
const DOUYIN = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 aweme/26.9.0 ByteLocale/zh-CN'
const ANDROID_CHROME =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36'
const MAC_DESKTOP =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15'
const FIREFOX_WIN =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0'
const UC_ANDROID =
  'Mozilla/5.0 (Linux; U; Android 13; zh-CN; Redmi) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.0.0 UCBrowser/15.0.0.0 Mobile Safari/537.36'
const HARMONY = 'Mozilla/5.0 (Phone; HarmonyOS 4.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36'
const PLAIN_CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'

test('枚举常量冻结且含 unknown 档', () => {
  assert.ok(CONTAINER_VALUES.includes('unknown'))
  assert.ok(OS_VALUES.includes('unknown'))
  assert.ok(ENGINE_VALUES.includes('unknown'))
  assert.ok(Object.isFrozen(CONTAINER_VALUES))
})

test('detectContainer：微信移动/桌面/小程序/抖音/PWA/普通浏览器/空', () => {
  assert.equal(detectContainer(IPHONE_WX), 'wechat')
  assert.equal(detectContainer(DESKTOP_WX_WIN), 'wechat-desktop')
  assert.equal(detectContainer(MINIPROGRAM), 'wechat-miniprogram-webview')
  assert.equal(detectContainer(DOUYIN), 'douyin')
  assert.equal(detectContainer(ANDROID_CHROME), 'browser')
  assert.equal(detectContainer(PLAIN_CHROME, { hasStandaloneDisplayMode: true }), 'pwa-standalone')
  assert.equal(detectContainer(''), 'unknown')
})

test('detectOs：iOS/Android/鸿蒙/Windows，iPadOS 伪装 macOS 靠触点数识别', () => {
  assert.equal(detectOs(IPHONE_WX), 'ios')
  assert.equal(detectOs(ANDROID_CHROME), 'android')
  assert.equal(detectOs(HARMONY), 'harmony')
  assert.equal(detectOs(FIREFOX_WIN), 'windows')
  assert.equal(detectOs(MAC_DESKTOP, 0), 'macos')
  // iPadOS 13+ 桌面 UA 伪装 Macintosh，只有触点数 >1 才敢判 ios
  assert.equal(detectOs(MAC_DESKTOP, 5), 'ios')
  // 拿不到触点数：不猜，落 unknown（与 share-kit 严格口径一致）
  assert.equal(detectOs(MAC_DESKTOP, undefined), 'unknown')
})

test('detectEngine：iOS 恒 wkwebview；国产内核先于 Blink；Firefox=gecko', () => {
  assert.equal(detectEngine(IPHONE_WX, 'ios'), 'wkwebview')
  assert.equal(detectEngine(ANDROID_CHROME, 'android'), 'blink')
  assert.equal(detectEngine(FIREFOX_WIN, 'windows'), 'gecko')
  assert.equal(detectEngine(UC_ANDROID, 'android'), 'u4')
  assert.equal(detectEngine('', 'unknown'), 'unknown')
})

test('detectVersionBand：<os>-<主版本>；判不出落 unknown', () => {
  assert.equal(detectVersionBand(IPHONE_WX, 'ios'), 'ios-17')
  assert.equal(detectVersionBand(ANDROID_CHROME, 'android'), 'android-14')
  assert.equal(detectVersionBand(FIREFOX_WIN, 'windows'), 'windows-10')
  assert.equal(detectVersionBand('', 'ios'), 'unknown')
})

test('normalizeFingerprint：纯函数，unknown 维度按序登记，signals 回显', () => {
  const out = normalizeFingerprint({ ua: IPHONE_WX, maxTouchPoints: 5 })
  assert.deepEqual(out.fingerprint, {
    container: 'wechat',
    os: 'ios',
    engine: 'wkwebview',
    versionBand: 'ios-17',
    unknown: [],
  })
  assert.equal(out.signals.maxTouchPoints, 5)

  const empty = normalizeFingerprint({})
  assert.deepEqual(empty.fingerprint.unknown, ['container', 'os', 'engine', 'versionBand'])
  assert.equal(empty.fingerprint.container, 'unknown')
})

test('normalizeFingerprint：不改入参、同输入同输出', () => {
  const signals = { ua: ANDROID_CHROME, maxTouchPoints: 0 }
  const snapshot = JSON.stringify(signals)
  const a = normalizeFingerprint(signals)
  const b = normalizeFingerprint(signals)
  assert.equal(JSON.stringify(signals), snapshot)
  assert.deepEqual(a, b)
})
