# fetchT

## 安装

通过 [JSR](https://jsr.io/@happy-ts/fetch-t) (**推荐**)
```
npx jsr add @happy-ts/fetch-t
```

或者直接使用 npm
```
npm install --save @happy-ts/fetch-t
```

通过 deno
```
deno add @happy-ts/fetch-t
```

通过 bun
```
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

更多示例可参见测试用例 <a href="tests/fetch.test.ts">fetch.test.ts</a>。