# fetchT

[![License](https://img.shields.io/npm/l/@happy-ts/fetch-t.svg)](LICENSE)
[![Build Status](https://github.com/JiangJie/fetch-t/actions/workflows/test.yml/badge.svg)](https://github.com/JiangJie/fetch-t/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/JiangJie/fetch-t/graph/badge.svg)](https://codecov.io/gh/JiangJie/fetch-t)
[![NPM version](https://img.shields.io/npm/v/@happy-ts/fetch-t.svg)](https://npmjs.org/package/@happy-ts/fetch-t)
[![NPM downloads](https://badgen.net/npm/dm/@happy-ts/fetch-t)](https://npmjs.org/package/@happy-ts/fetch-t)
[![JSR Version](https://jsr.io/badges/@happy-ts/fetch-t)](https://jsr.io/@happy-ts/fetch-t)
[![JSR Score](https://jsr.io/badges/@happy-ts/fetch-t/score)](https://jsr.io/@happy-ts/fetch-t/score)

[中文文档](README.cn.md)

Type-safe Fetch API wrapper with abortable requests, timeout support, progress tracking, and Rust-like Result error handling.

## Features

- **Abortable Requests** - Cancel requests anytime via `FetchTask.abort()`
- **Type-safe Responses** - Specify return type with `responseType` parameter
- **Timeout Support** - Auto-abort requests after specified milliseconds
- **Progress Tracking** - Monitor download progress with `onProgress` callback
- **Chunk Streaming** - Access raw data chunks via `onChunk` callback
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

### With Timeout

```ts
const result = await fetchT('https://api.example.com/data', {
    responseType: 'json',
    timeout: 3000, // Auto-abort after 3 seconds
});
```

### Progress Tracking

```ts
const result = await fetchT('https://api.example.com/large-file', {
    responseType: 'blob',
    onProgress(progressResult) {
        progressResult.inspect(progress => {
            const percent = (progress.completedByteLength / progress.totalByteLength * 100).toFixed(1);
            console.log(`Download: ${percent}%`);
        });
    },
});
```

### Error Handling

```ts
import { fetchT, ABORT_ERROR, TIMEOUT_ERROR } from '@happy-ts/fetch-t';

const result = await fetchT('https://api.example.com/data', {
    responseType: 'json',
    timeout: 3000,
});

if (result.isErr()) {
    const err = result.unwrapErr();
    if (err.name === TIMEOUT_ERROR) {
        console.log('Request timed out');
    } else if (err.name === ABORT_ERROR) {
        console.log('Request was aborted');
    } else {
        console.log('Request failed:', err.message);
    }
} else {
    console.log('Data:', result.unwrap());
}
```

## API

### `fetchT(url, options?)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string \| URL` | Request URL |
| `options` | `FetchInit` | Extended fetch options |

### `FetchInit` Options

Extends standard `RequestInit` with:

| Option | Type | Description |
|--------|------|-------------|
| `abortable` | `boolean` | If `true`, returns `FetchTask` instead of `FetchResponse` |
| `responseType` | `'text' \| 'arraybuffer' \| 'blob' \| 'json'` | Specifies return data type |
| `timeout` | `number` | Auto-abort after milliseconds |
| `onProgress` | `(result: IOResult<FetchProgress>) => void` | Download progress callback |
| `onChunk` | `(chunk: Uint8Array) => void` | Raw data chunk callback |

### `FetchTask<T>`

Returned when `abortable: true`:

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `response` | `FetchResponse<T>` | The response promise |
| `abort(reason?)` | `void` | Abort the request |
| `aborted` | `boolean` | Whether request was aborted |

### Constants

| Constant | Description |
|----------|-------------|
| `ABORT_ERROR` | Error name for aborted requests |
| `TIMEOUT_ERROR` | Error name for timed out requests |

## Examples

For more examples, see the [examples](examples/) directory.

## Documentation

Full API documentation is available at [https://jiangjie.github.io/fetch-t/](https://jiangjie.github.io/fetch-t/)

## License

[MIT](LICENSE)
