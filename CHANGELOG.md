# Changelog

本仓遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 格式，版本语义按 [SemVer](https://semver.org/lang/zh-CN/)。

## [Unreleased]

## [0.1.0] - 2026-10-08

### Added

- 首版：`normalizeFingerprint`（container / os / engine / versionBand 四维 + unknown 登记）。
- 能力位 `capabilities`：`isWechat` / `isWechatMobile` / `isDesktopWechat` / `isMiniprogram` / `isDouyin` / `isPwa` / `isMobile` / `isDesktop` / `isSmallGame`。
- 判定原语 `detectContainer` / `detectOs` / `detectEngine` / `detectVersionBand` 与枚举常量。
- 语义对齐 `share-kit/core/probe.mjs`（本包为其收敛目标）。
