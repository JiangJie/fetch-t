[**@happy-ts/fetch-t**](../index.md) • **Docs**

***

[@happy-ts/fetch-t](../index.md) / FetchTask

# Interface: FetchTask\<T\>

Defines the structure and behavior of a fetch task, including the ability to abort the task and check its status.

## Type parameters

| Type parameter | Description |
| :------ | :------ |
| `T` | The type of the data expected in the response. |

## Properties

| Property | Type | Description |
| :------ | :------ | :------ |
| `aborted` | `boolean` | Indicates whether the fetch task has been aborted. |
| `response` | [`FetchResponse`](../type-aliases/FetchResponse.md)\<`T`\> | The response of the fetch task, represented as an `AsyncResult`. |

## Methods

### abort()

```ts
abort(reason?): void
```

Aborts the fetch task, optionally with a reason for the abortion.

#### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `reason`? | `any` | An optional parameter to indicate why the task was aborted. |

#### Returns

`void`

#### Source

[src/fetch/defines.ts:22](https://github.com/JiangJie/fetch-t/blob/5ca54f90db4fac871c3148a812ceaa65b2b2c097/src/fetch/defines.ts#L22)
