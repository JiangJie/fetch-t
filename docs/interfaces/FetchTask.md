[**@happy-ts/fetch-t**](../README.md) • **Docs**

***

[@happy-ts/fetch-t](../README.md) / FetchTask

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

[src/fetch/defines.ts:22](https://github.com/JiangJie/fetch-t/blob/6a5239d36df6ec2fbc78b194fa1370d9bdc8caa2/src/fetch/defines.ts#L22)
