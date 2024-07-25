[**@happy-ts/fetch-t**](../README.md) • **Docs**

***

[@happy-ts/fetch-t](../README.md) / FetchTask

# Interface: FetchTask\<T\>

Defines the structure and behavior of a fetch task, including the ability to abort the task and check its status.

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The type of the data expected in the response. |

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `aborted` | `boolean` | Indicates whether the fetch task has been aborted. | [defines.ts:27](https://github.com/JiangJie/fetch-t/blob/9e5d8bc709fe9cc1630d97e0ca16ef403ee959bb/src/fetch/defines.ts#L27) |
| `response` | [`FetchResponse`](../type-aliases/FetchResponse.md)\<`T`\> | The response of the fetch task, represented as an `AsyncResult`. | [defines.ts:32](https://github.com/JiangJie/fetch-t/blob/9e5d8bc709fe9cc1630d97e0ca16ef403ee959bb/src/fetch/defines.ts#L32) |

## Methods

### abort()

```ts
abort(reason?): void
```

Aborts the fetch task, optionally with a reason for the abortion.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `reason`? | `any` | An optional parameter to indicate why the task was aborted. |

#### Returns

`void`

#### Defined in

[defines.ts:22](https://github.com/JiangJie/fetch-t/blob/9e5d8bc709fe9cc1630d97e0ca16ef403ee959bb/src/fetch/defines.ts#L22)
