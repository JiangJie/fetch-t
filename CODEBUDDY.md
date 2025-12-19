# CODEBUDDY.md

This file provides guidance to CodeBuddy Code when working with code in this repository.

## Project Overview

**fetchT** is a TypeScript library that wraps the native Fetch API with enhanced capabilities:
- Abortable requests via `FetchTask.abort()`
- Type-safe responses with `responseType` parameter ('text' | 'arraybuffer' | 'blob' | 'json')
- Timeout support
- Progress tracking with streaming
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
pnpm exec vitest run --filter "test name pattern"
```

**Note:** Tests use Vitest with MSW (Mock Service Worker) for API mocking. The test file is located at `tests/fetch.test.ts`.

### Examples
```bash
# Run example files
pnpm run eg
```

### Documentation
```bash
# Generate TypeDoc documentation to docs/
pnpm run docs
```

Documentation is hosted on GitHub Pages at https://jiangjie.github.io/fetch-t/

## Repository Structure

```
/data/workspace/fetch-t/
├── .github/workflows/         # CI/CD pipelines
│   ├── test.yml              # Run tests with Vitest + Codecov
│   ├── npm-publish.yml       # NPM registry publication
│   ├── npm-publish-github-packages.yml
│   └── jsr-publish.yml       # JSR registry publication
├── .vscode/
│   └── settings.json         # VSCode settings
├── docs/                     # Generated TypeDoc documentation (GitHub Pages)
├── examples/                 # Runnable usage examples
│   ├── main.ts              # Entry point (runs all examples)
│   ├── basic.ts             # Basic fetch requests
│   ├── with-progress.ts     # Progress tracking examples
│   ├── abortable.ts         # Abortable request examples
│   └── error-handling.ts    # Error handling patterns
├── src/                      # Source code
│   ├── fetch/
│   │   ├── constants.ts      # Error constants (ABORT_ERROR, TIMEOUT_ERROR)
│   │   ├── defines.ts        # All type definitions and interfaces
│   │   └── fetch.ts          # Core implementation with 10 function overloads
│   └── mod.ts                # Public API entry point (re-exports)
├── tests/
│   └── fetch.test.ts         # Vitest test suite with MSW mocking
├── .gitignore                # Excludes: node_modules, dist, coverage
├── CODEBUDDY.md              # This file
├── eslint.config.mjs         # ESLint configuration (strict + stylistic)
├── jsr.json                  # JSR registry metadata
├── LICENSE                   # MIT
├── package.json              # NPM metadata and scripts
├── pnpm-lock.yaml            # Dependency lockfile
├── README.md                 # English documentation
├── README.cn.md              # Chinese documentation
├── tsconfig.json             # TypeScript compiler options
├── typedoc.json              # TypeDoc documentation config
└── vite.config.ts            # Vite build + Vitest test configuration
```

## Code Architecture

### Source Structure

```
src/
├── mod.ts                    # Public API entry point (re-exports)
└── fetch/
    ├── constants.ts          # Error constants (ABORT_ERROR, TIMEOUT_ERROR)
    ├── defines.ts            # All type definitions and interfaces
    └── fetch.ts              # Core implementation with 10 function overloads
```

### Key Design Patterns

1. **Type-Safe Function Overloads**
   - The `fetchT` function has 10 distinct overloads to provide compile-time type safety
   - Return type varies based on `abortable` and `responseType` parameters
   - When `abortable: true`, returns `FetchTask<T>` instead of `FetchResponse<T>`
   - Overloads cover all combinations: 4 response types × abortable/non-abortable + fallback overloads

2. **Result Monad Pattern**
   - Uses `happy-rusty` library's `Result` type for explicit error handling
   - All responses are wrapped in `AsyncResult<T, E>` (no throwing exceptions)
   - Call `.inspect()` for success cases, `.inspectErr()` for errors
   - Use `.isOk()`, `.isErr()`, `.unwrap()`, `.unwrapErr()` for conditional handling
   - Example: `result.inspect(data => console.log(data)).inspectErr(err => console.error(err))`

3. **Stream Multiplexing**
   - Uses `ReadableStream.tee()` to split response streams
   - One stream for progress/chunk tracking, another for response body parsing
   - Enables progress callbacks without consuming the response
   - Creates a new Response object with the teed stream to maintain compatibility

4. **Timeout Mechanism**
   - Uses `AbortController` + `setTimeout` for timeout implementation
   - Timer is automatically cancelled when response completes or fails
   - Timeout errors are named `TIMEOUT_ERROR` for easy identification
   - `cancelTimer` function ensures cleanup to prevent memory leaks

5. **Custom Error Handling**
   - `FetchError` class extends Error with HTTP status codes
   - Constants for common error types: `ABORT_ERROR`, `TIMEOUT_ERROR`
   - Non-ok responses (e.g., 404, 500) return `Err(FetchError)` instead of throwing
   - Response body is cancelled on error to prevent resource leaks

### Core Types & Interfaces

**From `defines.ts`:**
- `FetchTask<T>` - Abortable fetch with:
  - `abort(reason?: any): void` - Cancels the request
  - `readonly aborted: boolean` - Check if aborted
  - `readonly response: FetchResponse<T>` - Get the response promise
- `FetchInit` - Extends RequestInit with custom options:
  - `abortable?: boolean` - Enable abort capability
  - `responseType?: FetchResponseType` - Specify return type
  - `timeout?: number` - Auto-abort after milliseconds
  - `onProgress?: (progressResult: IOResult<FetchProgress>) => void` - Track download progress
  - `onChunk?: (chunk: Uint8Array) => void` - Receive raw data chunks
- `FetchProgress` - Progress tracking with `totalByteLength` and `completedByteLength`
- `FetchResponseType` - Union type: `'text' | 'arraybuffer' | 'blob' | 'json'`
- `FetchResponse<T, E>` - Type alias for `AsyncResult<T, E>` from happy-rusty
- `FetchError` - Custom error class with `status: number` property for HTTP status codes

### Dependencies

**Runtime:**
- `happy-rusty` (^1.6.1) - Provides Result/AsyncResult types for functional error handling
- `tiny-invariant` (^1.3.3) - Runtime assertions and validation

**Dev:**
- TypeScript (^5.9.3) - Type checking and compilation
- Vite (^7.3.0) - Build tool and dev server
  - `vite-plugin-dts` (^4.5.4) - Bundles TypeScript definitions
- Vitest (^4.0.16) - Test framework
  - `@vitest/coverage-v8` (^4.0.16) - Coverage provider
- MSW (^2.12.4) - Mock Service Worker for API mocking in tests
- ESLint (^9.39.2) + typescript-eslint (^8.50.0) - Linting
- TypeDoc (^0.28.15) - Documentation generation

**External dependencies are marked as external in vite.config.ts** - they are not bundled.

## Build System

### Vite Configuration
- **Entry point:** `src/mod.ts`
- **Plugins:**
  - `vite-plugin-dts` - Bundles TypeScript definitions with `rollupTypes: true`
- **Build options:**
  - `target: 'esnext'` - Modern JavaScript output
  - `minify: false` - No minification for library
  - `sourcemap: true` - Source maps enabled
- **External dependencies:** happy-rusty, tiny-invariant (not bundled)
- **Tree shaking:** Set to 'smallest' for optimal bundle size
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
- 28 test cases with 100% coverage
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

**jsr-publish.yml** - JSR registry publication

## Code Style & Conventions

1. **Module System:** ES Modules only (type: "module" in package.json)
2. **TypeScript:** Strict mode with no unused variables/parameters
3. **Linting:** ESLint with TypeScript ESLint strict and stylistic rules
4. **Imports:** Use `.ts` extensions in source (allowed by bundler mode)
5. **Error Handling:** Prefer Result types over throwing exceptions
6. **Type Safety:** Leverage function overloads for compile-time safety
7. **Editor:** VSCode configured for format on save and organize imports

## Implementation Details

### fetchT Function Flow
1. **URL validation**: Uses `tiny-invariant` to ensure URL is string or URL object
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
8. **Return value**: FetchTask if abortable, otherwise FetchResponse

### Progress Tracking Details
- Requires `Content-Length` header to calculate progress
- If header missing, calls `onProgress(Err(new Error('No content-length...')))` once
- Compatible with both HTTP/1.1 and HTTP/2 (checks both header formats)
- Uses recursive promise chain for reading chunks
- Progress calculation: `completedByteLength += value.byteLength`

### AbortController Behavior
- Shared controller for both timeout and manual abort
- Timeout abort passes custom Error with `name: TIMEOUT_ERROR`
- Manual abort can pass any reason value
- Signal is added to fetch `RequestInit` automatically
- Controller only created when needed (`abortable: true` or `timeout` specified)

## Publishing

### Pre-publish Checklist
The `prepublishOnly` script automatically runs `pnpm run build`, which includes:
1. Type checking (`pnpm run check`)
2. Linting (`pnpm run lint`)
3. Vite build

### Distribution Targets
- **NPM:** @happy-ts/fetch-t
- **JSR:** @happy-ts/fetch-t
- **GitHub Packages:** Via workflow

### Distribution Package Includes (defined in package.json files array)
- LICENSE
- README.md
- README.cn.md
- CHANGELOG.md
- dist/

## Known Issues & Gotchas

1. **Progress tracking requires Content-Length header**: If the server doesn't send this header, progress tracking will fail (onProgress receives an Err). The code checks both `content-length` and `Content-Length` for HTTP/2 compatibility.

2. **Stream tee() limitation**: Progress/chunk callbacks add overhead due to stream splitting. Each chunk is read twice - once for tracking, once for parsing.

3. **Import extensions**: Source code uses `.ts` extensions in imports which is non-standard but enabled by TypeScript bundler mode.

4. **Invalid JSON handling**: When `responseType: 'json'` is specified but the response is invalid JSON, the function returns `Err(new Error('Response is invalid json...'))` instead of letting the parse error propagate.

5. **happy-rusty Result API**: Use `isOk()`, `isErr()`, `unwrap()`, `unwrapErr()` methods. Note that `match()` method does NOT exist in happy-rusty.

## Key Files Reference

### Source Code
- `src/mod.ts` - Main entry point (re-exports from fetch/)
- `src/fetch/fetch.ts` - Core fetchT implementation function with 10 overloads
- `src/fetch/defines.ts` - All type definitions (FetchTask, FetchInit, FetchError, etc.)
- `src/fetch/constants.ts` - Error constants (ABORT_ERROR, TIMEOUT_ERROR)

### Configuration
- `package.json` - NPM metadata, scripts, and dependencies
- `vite.config.ts` - Vite build configuration + Vitest test configuration
- `tsconfig.json` - TypeScript compiler options
- `eslint.config.mjs` - ESLint flat config
- `typedoc.json` - Documentation generation settings
- `jsr.json` - JSR registry metadata

### Tests & Examples
- `tests/fetch.test.ts` - Vitest test suite with MSW mocking
- `examples/main.ts` - Example entry point
- `examples/basic.ts` - Basic usage examples
- `examples/with-progress.ts` - Progress tracking examples
- `examples/abortable.ts` - Abortable request examples
- `examples/error-handling.ts` - Error handling examples

### CI/CD
- `.github/workflows/test.yml` - CI test workflow
- `.github/workflows/npm-publish.yml` - NPM publication
- `.github/workflows/jsr-publish.yml` - JSR publication

### Documentation
- `README.md` - English documentation
- `README.cn.md` - Chinese documentation
- `docs/` - Generated TypeDoc documentation (GitHub Pages)
