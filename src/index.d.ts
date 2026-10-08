/** 宿主容器枚举（含 unknown 档） */
export const CONTAINER_VALUES: readonly string[]
/** 操作系统枚举（含 unknown 档） */
export const OS_VALUES: readonly string[]
/** 浏览器内核枚举（含 unknown 档） */
export const ENGINE_VALUES: readonly string[]
/** 参与指纹判定的维度（顺序即 unknown 数组顺序） */
export const FINGERPRINT_DIMENSIONS: readonly string[]
/** 版本带判定规则 */
export const VERSION_BAND_PATTERNS: Readonly<Record<string, RegExp>>

/** 原始信号（纯数据，所有字段可缺） */
export interface EnvSignals {
  ua?: string
  maxTouchPoints?: number
  hasStandaloneDisplayMode?: boolean
  isMiniGame?: boolean
  [key: string]: unknown
}

export interface Fingerprint {
  container: string
  os: string
  engine: string
  versionBand: string
  unknown: string[]
}

export interface NormalizedEnvironment {
  fingerprint: Fingerprint
  signals: EnvSignals
}

export interface Capabilities {
  isWechat: boolean
  isWechatMobile: boolean
  isDesktopWechat: boolean
  isMiniprogram: boolean
  isDouyin: boolean
  isPwa: boolean
  isMobile: boolean
  isDesktop: boolean
  isSmallGame: boolean
}

export function detectContainer(ua: string, signals?: EnvSignals): string
export function detectOs(ua: string, maxTouchPoints?: number): string
export function detectEngine(ua: string, os: string): string
export function detectVersionBand(ua: string, os: string): string
export function normalizeFingerprint(signals?: EnvSignals): NormalizedEnvironment
export function capabilities(signals?: EnvSignals): Capabilities
