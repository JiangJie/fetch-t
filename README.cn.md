# fetchT

[![License](https://img.shields.io/npm/l/@happy-ts/fetch-t.svg)](LICENSE)
[![Build Status](https://github.com/JiangJie/fetch-t/actions/workflows/test.yml/badge.svg)](https://github.com/JiangJie/fetch-t/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/JiangJie/fetch-t/graph/badge.svg)](https://codecov.io/gh/JiangJie/fetch-t)
[![NPM version](https://img.shields.io/npm/v/@happy-ts/fetch-t.svg)](https://npmjs.org/package/@happy-ts/fetch-t)
[![NPM downloads](https://badgen.net/npm/dm/@happy-ts/fetch-t)](https://npmjs.org/package/@happy-ts/fetch-t)
[![JSR Version](https://jsr.io/badges/@happy-ts/fetch-t)](https://jsr.io/@happy-ts/fetch-t)
[![JSR Score](https://jsr.io/badges/@happy-ts/fetch-t/score)](https://jsr.io/@happy-ts/fetch-t/score)

类型安全的 Fetch API 封装，支持可中止请求、超时、进度追踪、自动重试和 Rust 风格的 Result 错误处理。

---

[English](README.md) | [API 文档](https://jiangjie.github.io/fetch-t/)

---

## 特性

- **可中止请求** - 随时通过 `FetchTask.abort()` 取消请求
- **类型安全响应** - 通过 `responseType` 参数指定返回类型 (`text`, `json`, `arraybuffer`, `bytes`, `blob`, `stream`)
- **超时支持** - 指定毫秒数后自动中止请求
- **进度追踪** - 通过 `onProgress` 回调监控下载进度
- **数据流处理** - 通过 `onChunk` 回调访问原始数据块
- **自动重试** - 通过 `retry` 选项配置失败重试策略
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

const result = await task.result;
```

### 自动重试

```ts
const result = await fetchT('https://api.example.com/data', {
    retry: {
        retries: 3,
        delay: (attempt) => Math.min(1000 * Math.pow(2, attempt - 1), 10000),
        when: [500, 502, 503, 504],
        onRetry: (error, attempt) => console.log(`重试 ${attempt}: ${error.message}`),
    },
    responseType: 'json',
});
```

## 示例

- [基础用法](examples/basic.ts) - 基本请求示例
- [进度追踪](examples/with-progress.ts) - 下载进度和数据流处理
- [可中止请求](examples/abortable.ts) - 取消和超时请求
- [自动重试](examples/with-retry.ts) - 自动重试策略
- [错误处理](examples/error-handling.ts) - 错误处理模式

## 错误处理设计

`fetchT` 区分两类错误：

### 编程错误（同步抛出）

无效参数会立即抛出异常，实现快速失败：

```ts
// 以下代码同步抛出异常 - 不需要 try/catch 包裹 await
fetchT('https://example.com', { timeout: -1 });     // Error: timeout 必须 > 0
fetchT('https://example.com', { timeout: 'bad' });  // TypeError: timeout 必须是数字
fetchT('not-a-url');                                // TypeError: 无效的 URL
```

这与原生 `fetch` 不同，原生 `fetch` 对参数错误返回 rejected Promise。同步抛出提供更清晰的调用栈，帮助在开发阶段发现问题。

### 运行时错误（Result 类型）

网络故障和 HTTP 错误通过 `Result` 类型包装：

```ts
const result = await fetchT('https://api.example.com/data', { responseType: 'json' });

if (result.isErr()) {
    const error = result.unwrapErr();
    // FetchError（包含状态码）或网络 Error
}
```

## 许可证

[MIT](LICENSE)
