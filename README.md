# fetchT

[![License](https://img.shields.io/npm/l/@happy-ts/fetch-t.svg)](LICENSE)
[![Build Status](https://github.com/JiangJie/fetch-t/actions/workflows/test.yml/badge.svg)](https://github.com/JiangJie/fetch-t/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/JiangJie/fetch-t/graph/badge.svg)](https://codecov.io/gh/JiangJie/fetch-t)
[![NPM version](https://img.shields.io/npm/v/@happy-ts/fetch-t.svg)](https://npmjs.org/package/@happy-ts/fetch-t)
[![NPM downloads](https://badgen.net/npm/dm/@happy-ts/fetch-t)](https://npmjs.org/package/@happy-ts/fetch-t)
[![JSR Version](https://jsr.io/badges/@happy-ts/fetch-t)](https://jsr.io/@happy-ts/fetch-t)
[![JSR Score](https://jsr.io/badges/@happy-ts/fetch-t/score)](https://jsr.io/@happy-ts/fetch-t/score)

Type-safe Fetch API wrapper with abortable requests, timeout support, progress tracking, automatic retry, and Rust-like Result error handling.

---

[中文](README.cn.md) | [API Documentation](https://jiangjie.github.io/fetch-t/)

---

## Features

- **Abortable Requests** - Cancel requests anytime via `FetchTask.abort()`
- **Type-safe Responses** - Specify return type with `responseType` parameter (`text`, `json`, `arraybuffer`, `bytes`, `blob`, `stream`)
- **Timeout Support** - Auto-abort requests after specified milliseconds
- **Progress Tracking** - Monitor download progress with `onProgress` callback
- **Chunk Streaming** - Access raw data chunks via `onChunk` callback
- **Automatic Retry** - Configurable retry strategies with `retry` option
- **Result Error Handling** - Rust-like `Result` type for explicit error handling
- **Cross-platform** - Works with Deno, Node.js, Bun, and browsers

## Installation

```sh
# npm
npm install @happy-ts/fetch-t

# yarn
yarn add @happy-ts/fetch-t

# pnpm
pnpm add @happy-ts/fetch-t

# JSR (Deno)
deno add @happy-ts/fetch-t

# JSR (Bun)
bunx jsr add @happy-ts/fetch-t
```

## Quick Start

### Basic Usage

```ts
import { fetchT } from '@happy-ts/fetch-t';

// GET JSON data
const result = await fetchT<{ id: number; title: string }>('https://api.example.com/data', {
    responseType: 'json',
});

result.inspect(data => {
    console.log(data.title);
}).inspectErr(err => {
    console.error('Request failed:', err.message);
});
```

### Abortable Request

```ts
const task = fetchT('https://api.example.com/large-file', {
    abortable: true,
    responseType: 'arraybuffer',
});

// Abort after 5 seconds
setTimeout(() => {
    task.abort('User cancelled');
}, 5000);

const result = await task.response;
```

### Automatic Retry

```ts
const result = await fetchT('https://api.example.com/data', {
    retry: {
        retries: 3,
        delay: (attempt) => Math.min(1000 * Math.pow(2, attempt - 1), 10000),
        when: [500, 502, 503, 504],
        onRetry: (error, attempt) => console.log(`Retry ${attempt}: ${error.message}`),
    },
    responseType: 'json',
});
```

## Examples

- [Basic](examples/basic.ts) - Basic fetch requests
- [Progress Tracking](examples/with-progress.ts) - Download progress and chunk streaming
- [Abortable](examples/abortable.ts) - Cancel and timeout requests
- [Retry](examples/with-retry.ts) - Automatic retry strategies
- [Error Handling](examples/error-handling.ts) - Error handling patterns

## License

[MIT](LICENSE)
