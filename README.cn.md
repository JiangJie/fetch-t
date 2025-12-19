# fetchT

[![NPM version](https://img.shields.io/npm/v/@happy-ts/fetch-t.svg)](https://npmjs.org/package/@happy-ts/fetch-t)
[![NPM downloads](https://badgen.net/npm/dm/@happy-ts/fetch-t)](https://npmjs.org/package/@happy-ts/fetch-t)
[![JSR Version](https://jsr.io/badges/@happy-ts/fetch-t)](https://jsr.io/@happy-ts/fetch-t)
[![JSR Score](https://jsr.io/badges/@happy-ts/fetch-t/score)](https://jsr.io/@happy-ts/fetch-t/score)
[![Build Status](https://github.com/JiangJie/fetch-t/actions/workflows/test.yml/badge.svg)](https://github.com/JiangJie/fetch-t/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/JiangJie/fetch-t/graph/badge.svg)](https://codecov.io/gh/JiangJie/fetch-t)
[![License](https://img.shields.io/npm/l/@happy-ts/fetch-t.svg)](https://github.com/JiangJie/fetch-t/blob/main/LICENSE)

[English](README.md)

类型安全的 Fetch API 封装，支持可中止请求、超时、进度追踪和 Rust 风格的 Result 错误处理。

## 特性

- **可中止请求** - 随时通过 `FetchTask.abort()` 取消请求
- **类型安全响应** - 通过 `responseType` 参数指定返回类型
- **超时支持** - 指定毫秒数后自动中止请求
- **进度追踪** - 通过 `onProgress` 回调监控下载进度
- **数据流处理** - 通过 `onChunk` 回调访问原始数据块
- **Result 错误处理** - Rust 风格的 `Result` 类型实现显式错误处理
- **跨平台** - 支持 Deno、Node.js、Bun 和浏览器

## 安装

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

## 快速开始

### 基础用法

```ts
import { fetchT } from '@happy-ts/fetch-t';

// GET JSON 数据
const result = await fetchT<{ id: number; title: string }>('https://api.example.com/data', {
    responseType: 'json',
});

result.inspect(data => {
    console.log(data.title);
}).inspectErr(err => {
    console.error('请求失败:', err.message);
});
```

### 可中止请求

```ts
const task = fetchT('https://api.example.com/large-file', {
    abortable: true,
    responseType: 'arraybuffer',
});

// 5 秒后中止
setTimeout(() => {
    task.abort('用户取消');
}, 5000);

const result = await task.response;
```

### 超时控制

```ts
const result = await fetchT('https://api.example.com/data', {
    responseType: 'json',
    timeout: 3000, // 3 秒后自动中止
});
```

### 进度追踪

```ts
const result = await fetchT('https://api.example.com/large-file', {
    responseType: 'blob',
    onProgress(progressResult) {
        progressResult.inspect(progress => {
            const percent = (progress.completedByteLength / progress.totalByteLength * 100).toFixed(1);
            console.log(`下载进度: ${percent}%`);
        });
    },
});
```

### 错误处理

```ts
import { fetchT, ABORT_ERROR, TIMEOUT_ERROR } from '@happy-ts/fetch-t';

const result = await fetchT('https://api.example.com/data', {
    responseType: 'json',
    timeout: 3000,
});

if (result.isErr()) {
    const err = result.unwrapErr();
    if (err.name === TIMEOUT_ERROR) {
        console.log('请求超时');
    } else if (err.name === ABORT_ERROR) {
        console.log('请求已中止');
    } else {
        console.log('请求失败:', err.message);
    }
} else {
    console.log('数据:', result.unwrap());
}
```

## API

### `fetchT(url, options?)`

| 参数 | 类型 | 描述 |
|------|------|------|
| `url` | `string \| URL` | 请求 URL |
| `options` | `FetchInit` | 扩展的 fetch 选项 |

### `FetchInit` 选项

继承标准 `RequestInit`，额外支持：

| 选项 | 类型 | 描述 |
|------|------|------|
| `abortable` | `boolean` | 如为 `true`，返回 `FetchTask` 而非 `FetchResponse` |
| `responseType` | `'text' \| 'arraybuffer' \| 'blob' \| 'json'` | 指定返回数据类型 |
| `timeout` | `number` | 指定毫秒数后自动中止 |
| `onProgress` | `(result: IOResult<FetchProgress>) => void` | 下载进度回调 |
| `onChunk` | `(chunk: Uint8Array) => void` | 原始数据块回调 |

### `FetchTask<T>`

当 `abortable: true` 时返回：

| 属性/方法 | 类型 | 描述 |
|-----------|------|------|
| `response` | `FetchResponse<T>` | 响应 Promise |
| `abort(reason?)` | `void` | 中止请求 |
| `aborted` | `boolean` | 请求是否已中止 |

### 常量

| 常量 | 描述 |
|------|------|
| `ABORT_ERROR` | 中止请求的错误名称 |
| `TIMEOUT_ERROR` | 超时请求的错误名称 |

## 示例

更多示例请参见 [examples](examples/) 目录。

## 文档

完整 API 文档请访问 [https://jiangjie.github.io/fetch-t/](https://jiangjie.github.io/fetch-t/)

## 许可证

[MIT](LICENSE)
