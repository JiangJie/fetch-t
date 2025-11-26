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
pnpm run prebuild  # Cleans dist/, runs check and lint
```

**Build outputs:**
- `dist/main.cjs` - CommonJS bundle
- `dist/main.mjs` - ES Module bundle
- `dist/types.d.ts` - TypeScript definitions

### Testing
```bash
# Run tests with coverage (using Deno)
pnpm run test

# Generate HTML coverage report
pnpm run test:html

# Run a specific test by name pattern
deno test -A --filter "test name pattern"
```

**Note:** Tests use Deno's native test runner. The test file is located at `tests/fetch.test.ts`.

### Documentation
```bash
# Generate TypeDoc documentation to docs/
pnpm run docs
```

## Repository Structure

```
/data/workspace/fetch-t/
├── .github/workflows/         # CI/CD pipelines
│   ├── test.yml              # Run tests with Deno + Codecov
│   ├── npm-publish.yml       # NPM registry publication
│   ├── npm-publish-github-packages.yml
│   └── jsr-publish.yml       # JSR registry publication
├── .vscode/
│   └── settings.json         # VSCode: format on save, Deno disabled for src/
├── docs/                     # Generated TypeDoc documentation
│   ├── classes/
│   ├── functions/
│   ├── interfaces/
│   ├── type-aliases/
│   ├── variables/
│   └── README.md
├── src/                      # Source code
│   ├── fetch/
│   │   ├── constants.ts      # Error constants (ABORT_ERROR, TIMEOUT_ERROR)
│   │   ├── defines.ts        # All type definitions and interfaces
│   │   └── fetch.ts          # Core implementation with 10 function overloads
│   └── mod.ts                # Public API entry point (re-exports)
├── tests/
│   └── fetch.test.ts         # Deno test suite
├── .gitignore                # Excludes: node_modules, dist, coverage
├── CODEBUDDY.md              # This file
├── deno.json                 # Deno configuration and imports
├── eslint.config.mjs         # ESLint configuration (strict + stylistic)
├── jsr.json                  # JSR registry metadata
├── LICENSE                   # GPL-3.0
├── package.json              # NPM metadata and scripts
├── pnpm-lock.yaml            # Dependency lockfile
├── README.md                 # English documentation
├── README.cn.md              # Chinese documentation
├── rollup.config.mjs         # Build configuration
├── tsconfig.json             # TypeScript compiler options
└── typedoc.json              # TypeDoc documentation config
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
   - Example: `result.inspect(data => console.log(data)).inspectErr(err => console.error(err))`

3. **Stream Multiplexing**
   - Uses `ReadableStream.tee()` to split response streams (line 175 in fetch.ts)
   - One stream for progress/chunk tracking, another for response body parsing
   - Enables progress callbacks without consuming the response
   - Creates a new Response object with the teed stream to maintain compatibility

4. **Timeout Mechanism**
   - Uses `AbortController` + `setTimeout` for timeout implementation (lines 255-271)
   - Timer is automatically cancelled when response completes or fails
   - Timeout errors are named `TIMEOUT_ERROR` for easy identification
   - `cancelTimer` function ensures cleanup to prevent memory leaks

5. **Custom Error Handling**
   - `FetchError` class extends Error with HTTP status codes
   - Constants for common error types: `ABORT_ERROR`, `TIMEOUT_ERROR`
   - Non-ok responses (e.g., 404, 500) return `Err(FetchError)` instead of throwing
   - Response body is cancelled on error to prevent resource leaks (line 164)

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
- `happy-rusty` (^1.5.0) - Provides Result/AsyncResult types for functional error handling
- `tiny-invariant` (^1.3.3) - Runtime assertions and validation

**Dev:**
- TypeScript (^5.9.3) - Type checking and compilation
- Rollup (^4.53.3) - Module bundler with plugins:
  - `rollup-plugin-esbuild` (^6.2.1) - Transpiles to ESNext
  - `rollup-plugin-dts` (^6.2.3) - Bundles TypeScript definitions
- ESLint (^9.39.1) + typescript-eslint (^8.48.0) - Linting
- TypeDoc (^0.27.9) + typedoc-plugin-markdown (^4.4.2) - Documentation generation

**External dependencies are marked as external in rollup.config.mjs** - they are not bundled.

## Build System

### Rollup Configuration
- **Entry point:** `src/mod.ts`
- **Plugins:**
  - `rollup-plugin-esbuild` - Transpiles to ESNext target
  - `rollup-plugin-dts` - Bundles TypeScript definitions
- **External dependencies:** happy-rusty, tiny-invariant (not bundled)
- **Tree shaking:** Set to 'smallest' for optimal bundle size
- **Output formats:** Both CommonJS (.cjs) and ES Module (.mjs) with source maps

### TypeScript Configuration
- **Target:** ESNext
- **Module:** ESNext with bundler resolution
- **Strict mode enabled** with additional strict flags:
  - `noUnusedLocals: true`
  - `noUnusedParameters: true`
  - `noPropertyAccessFromIndexSignature: true`
- **No emit mode** - Build is handled by Rollup
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
- Ignores `dist/` directory

## Testing Guidelines

### Test Structure
- Tests are in `tests/fetch.test.ts`
- Uses Deno's native test runner (`Deno.test()`)
- Uses public fake API (fakestoreapi.com) for integration testing
- Coverage includes:
  - All response types (text, arraybuffer, blob, JSON)
  - HTTP methods (GET, POST, PUT, PATCH, DELETE)
  - Progress and chunk callbacks
  - Abort and timeout functionality
  - Error scenarios (invalid JSON, 404 errors, invalid URLs)

### Coverage
- Uses Deno's built-in coverage tool
- CI uploads to Codecov with token authentication
- HTML reports available via `pnpm run test:html`
- Coverage files stored in `coverage/` directory (git-ignored)

## CI/CD

### GitHub Actions Workflows

**test.yml** - Runs on every push to main:
- Sets up Node.js (latest) and installs pnpm globally
- Sets up Deno for running tests
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
1. **URL validation** (lines 132-134): Uses `tiny-invariant` to ensure URL is string or URL object
2. **Options destructuring** (lines 136-144): Extracts custom options from FetchInit
3. **Abort controller setup** (lines 146-158): Creates controller if abortable or timeout specified
4. **Fetch execution** (line 160): Calls native fetch with processed options
5. **Response handling** (lines 160-248):
   - Check `res.ok` - return FetchError if false
   - Stream multiplexing for progress/chunk callbacks
   - Parse response based on `responseType`
   - Default to returning Response object
6. **Error handling** (lines 249-253): Catch and wrap in Err()
7. **Timeout setup** (lines 255-271): Schedule abort if timeout specified
8. **Return value** (lines 273-291): FetchTask if abortable, otherwise FetchResponse

### Progress Tracking Details
- Requires `Content-Length` header to calculate progress (lines 183-192)
- If header missing, calls `onProgress(Err(new Error('No content-length...')))` once
- Compatible with both HTTP/1.1 and HTTP/2 (checks both header formats)
- Uses recursive promise chain for reading chunks (lines 194-216)
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
1. Clean dist/ directory (via `pnpm dlx rimraf dist`)
2. Type checking (`pnpm run check`)
3. Linting (`pnpm run lint`)
4. Rollup build

### Distribution Targets
- **NPM:** @happy-ts/fetch-t
- **JSR:** @happy-ts/fetch-t
- **GitHub Packages:** Via workflow

### Distribution Package Includes
- Source code (`src/`)
- Built files (`dist/`)
- Documentation (`docs/`)
- README files (both English and Chinese)
- LICENSE (GPL-3.0)
- package.json, jsr.json

## Known Issues & Gotchas

1. **Progress tracking requires Content-Length header**: If the server doesn't send this header, progress tracking will fail (onProgress receives an Err). The code checks both `content-length` and `Content-Length` for HTTP/2 compatibility.

2. **Stream tee() limitation**: Progress/chunk callbacks add overhead due to stream splitting. Each chunk is read twice - once for tracking, once for parsing.

3. **Import extensions**: Source code uses `.ts` extensions in imports which is non-standard but enabled by TypeScript bundler mode. This is required for Deno compatibility.

4. **Deno vs Build environment**: The `.vscode/settings.json` disables Deno for `src/`, `eslint.config.mjs`, and `rollup.config.mjs` because these use Node.js-style module resolution during development/build, but tests use Deno.

5. **Invalid JSON handling**: When `responseType: 'json'` is specified but the response is invalid JSON, the function returns `Err(new Error('Response is invalid json...'))` instead of letting the parse error propagate.

## Key Files Reference

### Source Code
- `src/mod.ts:1-3` - Main entry point (re-exports from fetch/)
- `src/fetch/fetch.ts:130` - Core fetchT implementation function
- `src/fetch/fetch.ts:14-120` - 10 function overload signatures
- `src/fetch/fetch.ts:175` - Stream tee() for progress tracking
- `src/fetch/fetch.ts:183-192` - Content-Length header handling
- `src/fetch/fetch.ts:255-271` - Timeout implementation
- `src/fetch/defines.ts:16-33` - FetchTask interface
- `src/fetch/defines.ts:58-85` - FetchInit interface
- `src/fetch/defines.ts:90-104` - FetchError class
- `src/fetch/constants.ts:1-2` - Error constants

### Configuration
- `package.json:22-34` - Available npm scripts
- `package.json:56-59` - Runtime dependencies
- `rollup.config.mjs:17-52` - Build configuration (dual output)
- `tsconfig.json:1-29` - TypeScript compiler options
- `eslint.config.mjs:4-13` - ESLint flat config
- `typedoc.json:1-17` - Documentation generation settings
- `deno.json:1-7` - Deno imports and configuration
- `jsr.json:1-17` - JSR registry metadata

### Tests & CI
- `tests/fetch.test.ts:1` - Test suite
- `.github/workflows/test.yml:1` - CI test workflow
- `.github/workflows/npm-publish.yml` - NPM publication
- `.github/workflows/jsr-publish.yml` - JSR publication

### Documentation
- `README.md` - English documentation
- `README.cn.md` - Chinese documentation
- `docs/README.md` - Generated API documentation index
