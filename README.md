# fetchT

[![NPM version](http://img.shields.io/npm/v/@happy-ts/fetch-t.svg)](https://npmjs.org/package/@happy-ts/fetch-t)
[![JSR Version](https://jsr.io/badges/@happy-ts/fetch-t)](https://jsr.io/@happy-ts/fetch-t)
[![JSR Score](https://jsr.io/badges/@happy-ts/fetch-t/score)](https://jsr.io/@happy-ts/fetch-t/score)
[![Build Status](https://github.com/jiangjie/fetch-t/actions/workflows/test.yml/badge.svg)](https://github.com/jiangjie/fetch-t/actions/workflows/test.yml)

---

<a href="README.cn.md">[中文]</a>

---

## Abortable && Predictable

The return value of fetchT includes an `abort` method.

The return data of fetchT is of a specific type, which can be either `string`, `ArrayBuffer`, `Blob`, or `<T>(generic)`.

## Installation

via pnpm
```
pnpm add @happy-ts/fetch-t
```

or via yarn
```
yarn add @happy-ts/fetch-t
```

or just from npm
```
npm install --save @happy-ts/fetch-t
```

via JSR
```
jsr add @happy-ts/fetch-t
```

for deno
```
deno add @happy-ts/fetch-t
```

for bun
```
bunx jsr add @happy-ts/fetch-t
```

## Why fetchT

fetchT is a simple encapsulation of the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API, with two main modifications:

* It adds the `abortable` parameter. If `abortable: true` is passed, fetchT will return a `FetchTask` object that allows you to abort the request by calling `FetchTask.abort()`.
* It supports generic return values by adding the responseType parameter. The optional values for `responseType` include `'text' | 'arraybuffer' | 'blob' | 'json'`. The return value corresponds to the parameter and can be either `string | ArrayBuffer | Blob | T`, where T is the generic type. All return values are of the [Result](https://github.com/JiangJie/happy-rusty) type, which facilitates error handling.

If you don't have these requirements, it is recommended to use the vanilla [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

## Examples

```ts
import { fetchT } from '@happy-ts/fetch-t';

const fetchTask = fetchT('https://example.com', {
    abortable: true,
    responseType: 'json',
});

somethingHappenAsync(() => {
    fetchTask.abort('cancel');
});

const res = await fetchTask.response;
if (res.isErr()) {
    console.assert(res.err() === 'cancel');
} else {
    console.log(res.unwrap());
}
```

For more examples, please refer to test case <a href="tests/fetch.test.ts">fetch.test.ts</a>.