# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-12-19

### Changed

- **BREAKING**: Migrate from Deno test runner to Vitest with MSW mocking
- **BREAKING**: Migrate from Rollup to Vite for building
- **BREAKING**: Change license from GPL-3.0 to MIT
- Upgrade `happy-rusty` dependency to ^1.6.1
- Upgrade all dev dependencies to latest versions
- Rewrite README with improved structure, examples, and API documentation
- Update GitHub Actions workflows for Vitest

### Added

- Add `examples/` directory with runnable usage examples
- Add ESLint stylistic rules for code formatting
- Add TypeDoc HTML documentation hosted on GitHub Pages

### Removed

- Remove Deno configuration (`deno.json`)
- Remove Rollup configuration (`rollup.config.mjs`)

## [1.3.3] - 2025-11-27

### Fixed

- Add npm imports to jsr.json for JSR publishing
- Override name attribute in FetchError class
- Comment out assertion for progress result in fetch test

### Changed

- Upgrade rollup-plugin-dts to v6.3.0
- Update ESLint config with new API and rules
- Upgrade dev dependencies
- Update deno dependencies and import sources
- Remove .npmrc file

## [1.3.2] - 2024-08-13

### Changed

- The error type returned by a non-abortable `fetch` is explicitly `Error`

## [1.3.1] - 2024-08-11

### Changed

- Update dependencies

## [1.3.0] - 2024-08-07

### Added

- Support `onProgress` callback for tracking download progress
- Support `onChunk` callback for receiving raw data chunks
- Complete test cases for new features

### Changed

- Update dependencies
- Update installation section of readme

## [1.2.1] - 2024-08-05

### Changed

- Update happy-rusty dependency
- Make test cases clearer

## [1.2.0] - 2024-08-04

### Changed

- Returns a `FetchError` when the response is not ok (instead of generic Error)
- Update happy-rusty dependency

## [1.1.1] - 2024-08-03

### Changed

- Update deno imports
- Update dependencies

## [1.1.0] - 2024-08-02

### Changed

- Reorganize the code structure
- Update happy-rusty to v1.3.0
- Fill test cases

## [1.0.0] - Initial Release

### Added

- Abortable requests via `FetchTask.abort()`
- Type-safe responses with `responseType` parameter ('text' | 'arraybuffer' | 'blob' | 'json')
- Timeout support
- Rust-like Result type error handling via `happy-rusty` library

[Unreleased]: https://github.com/JiangJie/fetch-t/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/JiangJie/fetch-t/compare/v1.3.3...v1.4.0
[1.3.3]: https://github.com/JiangJie/fetch-t/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/JiangJie/fetch-t/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/JiangJie/fetch-t/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/JiangJie/fetch-t/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/JiangJie/fetch-t/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/JiangJie/fetch-t/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/JiangJie/fetch-t/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/JiangJie/fetch-t/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/JiangJie/fetch-t/releases/tag/v1.0.0
