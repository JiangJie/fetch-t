# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2026-01-08

### Added

- Export `FetchResponseData` union type for dynamic `responseType` scenarios
- Add `FetchResponseType` union overloads for when `responseType` is a type variable (not a literal)
- Add `examples/overload-demonstration.ts` showcasing all fetchT overloads with explicit type annotations

### Changed

- Add `abortable?: false` constraint to non-abortable overloads for stricter type checking
- Update JSDoc for non-abortable overloads to document `abortable must be false or omitted` constraint

## [1.6.0] - 2026-01-06

### Added

- Add `'bytes'` responseType to return `Uint8Array` via `Response.bytes()` (with fallback for older environments)

### Changed

- Refactor signal handling: extract `configureSignal()` function to ensure fresh timeout signal on retries
- Refactor progress tracking to use `response.clone()` instead of `stream.tee()`
- Simplify `setupProgressCallbacks` with `for-await-of` loop
- Use `AsyncIOResult` type alias for internal consistency
- Use stricter `Uint8Array<ArrayBuffer>` typing throughout
- Upgrade `typescript-eslint` to ^8.52.0

### Fixed

- Fix `body.cancel()` rejection handling on non-ok responses
- Fix stream reader cancellation on error to release resources
- Fix `json` and `stream` responseType to return `null` for empty body

## [1.5.1] - 2026-01-04

### Fixed

- Fix `ReadableStream<Uint8Array<ArrayBuffer>>` type parameter for abortable stream overload
- Fix `ReadableStream` generic type parameter

### Changed

- Refactor `multiplexStream` as internal function of `fetchT` for better encapsulation
- Use `Number.parseInt` instead of global `parseInt` for stricter linting compliance
- Upgrade `happy-rusty` dependency to ^1.9.0

## [1.5.0] - 2026-01-04

### Added

- Add automatic retry support with configurable strategies (`retry` option)
  - `retries`: Number of retry attempts
  - `delay`: Static delay or exponential backoff function
  - `when`: Retry on specific HTTP status codes or custom condition
  - `onRetry`: Callback before each retry attempt
- Add `'stream'` responseType to return raw `ReadableStream<Uint8Array>`
- Add runtime validation for `fetchT` options (responseType, timeout, callbacks, retry)
- Add `examples/with-retry.ts` with comprehensive retry examples

### Changed

- Optimize timeout handling using native `AbortSignal.timeout()` and `AbortSignal.any()` APIs
- Upgrade `happy-rusty` dependency to ^1.8.0
- Upgrade `typescript-eslint` to ^8.51.0
- Upgrade `msw` to ^2.12.7

### Fixed

- Fix abort reason always wrapped as Error with proper `ABORT_ERROR` name

## [1.4.1] - 2025-12-25

### Fixed

- Fix unhandled promise rejections when `onChunk` or `onProgress` callbacks throw errors
- Fix unhandled promise rejections during stream read errors

### Changed

- Upgrade `happy-rusty` dependency to ^1.6.2
- Upgrade `typescript-eslint` to ^8.50.1

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

[1.7.0]: https://github.com/JiangJie/fetch-t/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/JiangJie/fetch-t/compare/v1.5.1...v1.6.0
[1.5.1]: https://github.com/JiangJie/fetch-t/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/JiangJie/fetch-t/compare/v1.4.1...v1.5.0
[1.4.1]: https://github.com/JiangJie/fetch-t/compare/v1.4.0...v1.4.1
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
