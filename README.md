# @hxym18/env

终端/环境判定的**唯一来源**：把 UA 指纹归一成脱敏四维（container / os / engine / versionBand），
并派生统一的能力位（微信内 / 桌面微信 / 小程序 / 抖音 / PWA / 移动 / 桌面 / 小游戏）。

各站不再各写一份 `navigator.userAgent` 正则——按端分支一律走本包。

- **零依赖**、纯函数；不读宿主 API（UA 等原始信号由调用方适配层采集后传入），因此可完整单测。
- 判不准的维度落 `unknown` 并登记进 `fingerprint.unknown`，绝不用默认值冒充已知。

## 安装

```bash
pnpm add github:everythingIsZero/env#v0.1.0
```

## API

```js
import { normalizeFingerprint, capabilities } from '@hxym18/env'

// 指纹（脱敏四维）
normalizeFingerprint({ ua, maxTouchPoints, hasStandaloneDisplayMode })
// → { fingerprint: { container, os, engine, versionBand, unknown: [] }, signals }

// 能力位（冻结对象）
capabilities({ ua, maxTouchPoints, hasStandaloneDisplayMode, isMiniGame })
// → { isWechat, isWechatMobile, isDesktopWechat, isMiniprogram, isDouyin,
//     isPwa, isMobile, isDesktop, isSmallGame }
```

### 采集原始信号

本包不碰 `navigator`。浏览器侧由调用方（或框架适配层）采集：

```js
const signals = {
  ua: navigator.userAgent,
  maxTouchPoints: navigator.maxTouchPoints,
  hasStandaloneDisplayMode: matchMedia('(display-mode: standalone)').matches || navigator.standalone === true,
}
```

Taro/小程序侧按 Taro API 采集，或对无 UA 的宿主（小游戏）直接给显式信号（如 `isMiniGame`）。

## 边界与收敛

- 语义与 `share-kit/src/core/probe.mjs` 一致。share-kit 按 **forward-only** 在下次因需求改动时切到本包依赖，
  届时 probe 逻辑单一来源在此；在此之前存在一份临时副本，属计划内过渡。
- 矩阵中「判不准不猜」：Mac UA 拿不到 `maxTouchPoints` 时落 `unknown`，不默认成 macos。

## 测试

```bash
npm test        # node --test
```
