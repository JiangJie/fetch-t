# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

**fetchT** is a TypeScript library that wraps the native Fetch API with enhanced capabilities:
- Abortable requests via `FetchTask.abort()`
- Type-safe responses with `responseType` parameter ('text' | 'arraybuffer' | 'blob' | 'json' | 'bytes' | 'stream')
- Timeout support
- Progress tracking with streaming
- Automatic retry with configurable strategies
- Rust-like Result type error handling via `happy-rusty` library

Published to both NPM (@happy-ts/fetch-t) and JSR registries with support for Deno, Node, Bun, and browsers.

## Development Commands

### Type Checking & Linting
```bash
# Type check without emitting files
pnpm run check

# Lint the codebase
pnpm run lint
```

### Building
```bash
# Full build (includes prebuild checks)
pnpm run build

# Manual prebuild steps (runs automatically before build)
pnpm run prebuild  # Runs check and lint
```

**Build outputs:**
- `dist/main.cjs` - CommonJS bundle
- `dist/main.mjs` - ES Module bundle
- `dist/types.d.ts` - TypeScript definitions

### Testing
```bash
# Run tests with coverage
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with UI
pnpm run test:ui

# Run a specific test by name pattern
pnpm exec vitest run -t "test name pattern"

# Run a specific test file
pnpm exec vitest run tests/fetch.test.ts
```

**Note:** Tests use Vitest with MSW (Mock Service Worker) for API mocking. The test file is located at `tests/fetch.test.ts`.

### Examples
```bash
# Run example files (requires Node.js >= 22 for native TypeScript execution)
pnpm run eg
```

### Documentation
```bash
# Generate TypeDoc documentation to docs/
pnpm run docs
```

Documentation is hosted on GitHub Pages at https://jiangjie.github.io/fetch-t/

## Repository Structure

Only the directories needed for daily work are listed; configuration files and CI workflows are discoverable via `ls`.

```
src/
├── mod.ts                # Public API entry point (re-exports)
└── fetch/
    ├── constants.ts      # Error constants (ABORT_ERROR, TIMEOUT_ERROR)
    ├── defines.ts        # All type definitions and interfaces
    └── fetch.ts          # Core implementation with 12 function overloads

tests/
└── fetch.test.ts         # Vitest test suite with MSW mocking

examples/                 # Runnable usage examples (main.ts is the entry)
```

### pnpm 10 build script approval

`pnpm-workspace.yaml` declares `allowBuilds.msw: true` to explicitly permit `msw`'s postinstall (it injects `mockServiceWorker.js`). pnpm 10 blocks postinstall scripts by default, so when adding any new dependency that ships build scripts, update `allowBuilds` accordingly — otherwise `pnpm i` will pause waiting for manual approval.

## Code Architecture

### Key Design Patterns

1. **Type-Safe Function Overloads**
   - The `fetchT` function has 12 distinct overloads to provide compile-time type safety
   - Return type varies based on `abortable` and `responseType` parameters
   - When `abortable: true`, returns `FetchTask<T>` instead of `FetchResult<T>`
   - Overloads cover all combinations: 5 response types × abortable/non-abortable + fallback overloads
   - **Ordering constraint**: overloads are arranged from most-specific to most-generic (specific `abortable: true` × `responseType` first, fallbacks last). When editing `src/fetch/fetch.ts`, preserve this order — TypeScript picks the first matching signature, so reordering causes calls to silently fall through to the generic one and lose narrow return types.

2. **Result Monad Pattern**
   - Uses `happy-rusty` library's `Result` type for explicit error handling
   - All responses are wrapped in `AsyncResult<T, E>` (no throwing exceptions)
   - Call `.inspect()` for success cases, `.inspectErr()` for errors
   - Use `.isOk()`, `.isErr()`, `.unwrap()`, `.unwrapErr()` for conditional handling
   - Example: `result.inspect(data => console.log(data)).inspectErr(err => console.error(err))`

3. **Response Cloning for Progress Tracking**
   - Uses `response.clone()` to create a separate copy for progress/chunk tracking
   - Original response is used for body parsing, clone is consumed for progress
   - Enables progress callbacks without affecting the response consumption
   - **Design note**: `response.clone()` internally uses `ReadableStream.tee()`, so using `tee()` directly would not reduce overhead. Both streams share the same underlying data source; data is only buffered in memory when consumption speeds differ between the two streams. This is a reasonable trade-off between code simplicity and performance.

4. **Timeout Mechanism**
   - Uses `AbortSignal.timeout()` for timeout implementation (modern browser API)
   - Uses `AbortSignal.any()` to combine user abort signal with timeout signal
   - Timeout errors are named `TimeoutError` (native DOMException)

5. **Retry Mechanism**
   - Configurable via `retry` option (number or `FetchRetryOptions` object)
   - Supports static delay or exponential backoff via delay function
   - Customizable retry conditions: network errors (default), specific HTTP status codes, or custom function
   - `onRetry` callback for logging/metrics before each retry attempt
   - User abort stops all retry attempts immediately

6. **Custom Error Handling**
   - `FetchError` class extends Error with HTTP status codes
   - Constants for common error types: `ABORT_ERROR`, `TIMEOUT_ERROR`
   - Non-ok responses (e.g., 404, 500) return `Err(FetchError)` instead of throwing
   - Response body is cancelled on error to prevent resource leaks

### Core Types & Interfaces

**From `defines.ts`:**
- `FetchTask<T>` - Abortable fetch with:
  - `abort(reason?: any): void` - Cancels the request
  - `readonly aborted: boolean` - Check if aborted
  - `readonly result: FetchResult<T>` - Get the result promise
- `FetchInit` - Extends RequestInit with custom options:
  - `abortable?: boolean` - Enable abort capability
  - `responseType?: FetchResponseType` - Specify return type
  - `timeout?: number` - Auto-abort after milliseconds
  - `retry?: number | FetchRetryOptions` - Retry configuration
  - `onProgress?: (progressResult: IOResult<FetchProgress>) => void` - Track download progress
  - `onChunk?: (chunk: Uint8Array) => void` - Receive raw data chunks
- `FetchRetryOptions` - Retry configuration:
  - `retries?: number` - Number of retry attempts (default: 0)
  - `delay?: number | ((attempt: number) => number)` - Delay between retries
  - `when?: number[] | ((error: Error, attempt: number) => boolean)` - Retry conditions
  - `onRetry?: (error: Error, attempt: number) => void` - Callback before retry
- `FetchProgress` - Progress tracking with `totalByteLength` and `completedByteLength`
- `FetchResponseType` - Union type: `'text' | 'arraybuffer' | 'blob' | 'json' | 'bytes' | 'stream'`
- `FetchResult<T>` - Type alias for `AsyncIOResult<T>` from happy-rusty
- `FetchError` - Custom error class with `status: number` property for HTTP status codes

### Dependencies

Exact versions live in `package.json` — only the ecosystem roles are documented here to avoid drift.

**Runtime:**
- `happy-rusty` — provides `Result` / `AsyncResult` types for functional error handling. Marked `external` in `vite.config.ts`, not bundled.

**Dev:**
- TypeScript — type checking only (no emit; build is Vite's job)
- Vite — library build tool
  - `unplugin-dts` (with `bundleTypes: true`) + `@microsoft/api-extractor` — bundles `.d.ts` into a single `dist/types.d.ts` (replaced `vite-plugin-dts`)
- Vitest + `@vitest/coverage-v8` — test framework + v8 coverage
- MSW — Mock Service Worker for HTTP mocking in tests
- ESLint + typescript-eslint + `@stylistic/eslint-plugin` — linting (flat config)
- TypeDoc — API documentation generation

## Build System

### Vite Configuration
- **Entry point:** `src/mod.ts`
- **Plugins:**
  - `unplugin-dts/vite` with `bundleTypes: true` — bundles all `.d.ts` into a single file via `@microsoft/api-extractor`
- **Build options:**
  - `target: 'esnext'` - Modern JavaScript output
  - `minify: false` - No minification for library
  - `sourcemap: true` - Source maps enabled
- **External dependencies:** `happy-rusty` (not bundled)
- **Tree shaking:** Custom config with `moduleSideEffects: false` and `propertyReadSideEffects: false`
- **Output formats:** Both CommonJS (.cjs) and ES Module (.mjs)

### Vitest Configuration (in vite.config.ts)
- **Test pattern:** `**/*.test.ts`
- **Coverage provider:** v8
- **Coverage reporters:** text, json, html, lcov
- **Coverage include:** `src/**/*.ts`

### TypeScript Configuration
- **Target:** ESNext
- **Module:** ESNext with bundler resolution
- **Strict mode enabled** with additional strict flags:
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `noPropertyAccessFromIndexSignature: true`
- **No emit mode** - Build is handled by Vite
- **Module detection:** Forced to treat all files as modules
- **Bundler mode features:**
  - `allowImportingTsExtensions: true` - Allows `.ts` extensions in imports
  - `verbatimModuleSyntax: true` - Enforces explicit type imports

### ESLint Configuration
- Uses flat config format (`eslint.config.mjs`)
- Extends:
  - `@eslint/js` recommended rules
  - TypeScript ESLint strict rules
  - TypeScript ESLint stylistic rules
  - `@stylistic/eslint-plugin` for code formatting
- Ignores `dist/` directory

## Testing Guidelines

### Test Structure
- Tests are in `tests/fetch.test.ts`
- Uses Vitest as test framework
- Uses MSW (Mock Service Worker) for HTTP mocking
- Coverage target is near-100%; see Codecov or the local `coverage/` HTML report for the current numbers
- Coverage includes:
  - All response types (text, arraybuffer, blob, JSON)
  - HTTP methods (GET, POST, PUT, PATCH, DELETE)
  - Progress and chunk callbacks
  - Abort and timeout functionality
  - Error scenarios (invalid JSON, 404 errors, network errors)

### MSW Setup
- Mock server configured with handlers for various endpoints
- Supports streaming responses for progress testing
- Handles error scenarios (404, network errors)

### Coverage
- Uses Vitest's v8 coverage provider
- CI uploads to Codecov with token authentication
- HTML reports available via coverage output
- Coverage files stored in `coverage/` directory (git-ignored)

## CI/CD

### GitHub Actions Workflows

**test.yml** - Runs on every push to main:
- Sets up Node.js (latest) and pnpm
- Runs `pnpm test` (includes coverage generation)
- Uploads coverage to Codecov

**npm-publish.yml** - NPM registry publication

**npm-publish-github-packages.yml** - GitHub Packages registry

**jsr-publish.yml** - JSR registry publication (triggers on release creation)

## Code Style & Conventions

1. **Module System:** ES Modules only (type: "module" in package.json)
2. **TypeScript:** Strict mode with no unused variables/parameters
3. **Linting:** ESLint with TypeScript ESLint strict and stylistic rules
4. **Imports:** Use `.ts` extensions in source (allowed by bundler mode)
5. **Error Handling:** Prefer Result types over throwing exceptions
6. **Type Safety:** Leverage function overloads for compile-time safety
7. **Editor:** VSCode configured for format on save and organize imports

### Commit Convention

- Follow **Conventional Commits** (`feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `style`)
- **Write commit messages in English** for this repository (this overrides any global Chinese-default preference). The project is an open-source library published to NPM/JSR with English-first documentation, so the git history should match.

## Implementation Details

### fetchT Function Flow
1. **URL validation**: Validates URL is string or URL object, throws TypeError for invalid URLs
2. **Options destructuring**: Extracts custom options from FetchInit
3. **Abort controller setup**: Creates controller if abortable or timeout specified
4. **Fetch execution**: Calls native fetch with processed options
5. **Response handling**:
   - Check `res.ok` - return FetchError if false
   - Stream multiplexing for progress/chunk callbacks
   - Parse response based on `responseType`
   - Default to returning Response object
6. **Error handling**: Catch and wrap in Err()
7. **Timeout setup**: Schedule abort if timeout specified
8. **Return value**: FetchTask if abortable, otherwise FetchResult

### Progress Tracking Details
- Requires `Content-Length` header to calculate progress
- If header missing, calls `onProgress(Err(new Error('No content-length...')))` once
- Uses case-insensitive header lookup (per HTTP spec)
- Uses recursive promise chain for reading chunks
- Progress calculation: `completedByteLength += value.byteLength`

### AbortController Behavior
- User abort controller created only when `abortable: true`
- Timeout uses native `AbortSignal.timeout()` API
- Multiple signals combined via `AbortSignal.any()`
- Manual abort wraps non-Error reasons in Error with `name: ABORT_ERROR`
- Signal is added to fetch `RequestInit` automatically

## Publishing

`prepublishOnly` triggers `pnpm run build`, which itself runs `prebuild` (= `check` + `lint`) before the Vite build. The single source of truth for the pipeline is the `scripts` block in `package.json`.

### Distribution Targets
- **NPM:** @happy-ts/fetch-t
- **JSR:** @happy-ts/fetch-t
- **GitHub Packages:** Via workflow

### Distribution Package Includes (defined in package.json files array)
- LICENSE
- README.md
- CHANGELOG.md
- dist/

## Error Handling Design

`fetchT` distinguishes between two types of errors:

### Programming Errors (Synchronous)
Invalid parameters throw immediately for fail-fast behavior:
- `TypeError` for type validation (wrong type, not a function, invalid enum value)
- `Error` for value range validation (negative numbers, zero/negative timeout)

This differs from native `fetch`, which returns rejected Promises for parameter errors. Synchronous throws provide clearer stack traces and catch bugs during development.

### Runtime Errors (Result Type)
Network failures and HTTP errors are wrapped in `Result` type via `happy-rusty`. Use `.isOk()`, `.isErr()`, `.unwrap()`, `.unwrapErr()` for conditional handling.

## Known Issues & Gotchas

1. **Progress tracking requires Content-Length header**: If the server doesn't send this header, progress tracking will fail (onProgress receives an Err). The `Headers.get()` method is case-insensitive per the HTTP spec.

2. **Response cloning overhead**: Progress/chunk callbacks use `response.clone()` which internally calls `ReadableStream.tee()`. The overhead comes from memory buffering when the two streams (progress tracking vs body parsing) consume data at different speeds. For typical API responses this is negligible, but for very large file downloads users should be aware of potential memory implications. Using `tee()` directly would not reduce this overhead since `clone()` already uses it internally.

3. **Import extensions**: Source code uses `.ts` extensions in imports which is non-standard but enabled by TypeScript bundler mode.

4. **Invalid JSON handling**: When `responseType: 'json'` is specified but the response is invalid JSON, the function returns `Err(new Error('Response is invalid json...'))` instead of letting the parse error propagate.

5. **happy-rusty Result API**: Use `isOk()`, `isErr()`, `unwrap()`, `unwrapErr()` methods. Note that `match()` method does NOT exist in happy-rusty.

6. **Retry behavior**: By default, only network errors trigger retries. HTTP errors (4xx, 5xx) require explicit configuration via the `when` option in `FetchRetryOptions`.
