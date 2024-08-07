# fetchT

[![NPM version](http://img.shields.io/npm/v/@happy-ts/fetch-t.svg)](https://npmjs.org/package/@happy-ts/fetch-t)
[![JSR Version](https://jsr.io/badges/@happy-ts/fetch-t)](https://jsr.io/@happy-ts/fetch-t)
[![JSR Score](https://jsr.io/badges/@happy-ts/fetch-t/score)](https://jsr.io/@happy-ts/fetch-t/score)
[![Build Status](https://github.com/jiangjie/fetch-t/actions/workflows/test.yml/badge.svg)](https://github.com/jiangjie/fetch-t/actions/workflows/test.yml)
[![codecov](https://codecov.io/gh/JiangJie/fetch-t/graph/badge.svg)](https://codecov.io/gh/JiangJie/fetch-t)

---

## 可终止 && 可预测

fetchT 的返回值包含一个可以 abort 的方法。

fetchT 的返回数据是一个明确的类型，可以是 `string` `ArrayBuffer` `Blob` `<T>(泛型)`。

支持超时自动取消请求。

支持进度回调。

## 安装

```sh
# via pnpm
pnpm add @happy-ts/fetch-t
# or via yarn
yarn add @happy-ts/fetch-t
# or just from npm
npm install --save @happy-ts/fetch-t
# via JSR
jsr add @happy-ts/fetch-t
# for deno
deno add @happy-ts/fetch-t
# for bun
bunx jsr add @happy-ts/fetch-t
```

## 为什么会有 fetchT

fetchT 是对 [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API 的简单封装，主要包括两点修改：

* 增加 `abortable` 参数，如果传入 `abortable: true`，则 fetchT 会返回一个 `FetchTask`，可以通过调用 `FetchTask.abort()` 来终止请求。
* 支持泛型返回值，增加 `responseType` 参数，可选值包括 `'text' | 'arraybuffer' | 'blob' | 'json'`，返回值根据参数不同，对应返回 `string | ArrayBuffer | Blob | T`，并且返回值都是 [Result](https://github.com/JiangJie/happy-rusty) 类型，便于错误处理。

如果你没有以上需求，推荐使用原版 [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)。

## 示例

```ts
import { fetchT } from '@happy-ts/fetch-t';

const fetchTask = fetchT('https://example.com', {
    abortable: true,
    responseType: 'json',
    timeout: 3000,
    onChunk(chunk): void {
        console.assert(chunk instanceof Uint8Array);
    },
    onProgress(progressResult): void {
        progressResult.inspect(progress => {
            console.log(`${ progress.completedByteLength }/${ progress.totalByteLength }`);
        }).inspectErr(err => {
            console.error(err);
        });
    },
});

somethingHappenAsync(() => {
    fetchTask.abort('cancel');
});

const res = await fetchTask.response;
res.inspect(data => {
    console.log(data);
}).inspectErr(err => {
    console.assert(err === 'cancel');
});
```

更多示例可参见测试用例 <a href="tests/fetch.test.ts">fetch.test.ts</a>。

## [文档](docs/README.md)