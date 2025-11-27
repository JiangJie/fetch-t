[**@happy-ts/fetch-t**](../README.md)

***

[@happy-ts/fetch-t](../README.md) / FetchError

# Class: FetchError

Defined in: [defines.ts:90](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/defines.ts#L90)

Represents an error that occurred during a fetch operation when the response is not ok.

## Extends

- `Error`

## Constructors

### new FetchError()

```ts
new FetchError(message, status): FetchError
```

Defined in: [defines.ts:100](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/defines.ts#L100)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `status` | `number` |

#### Returns

[`FetchError`](FetchError.md)

#### Overrides

```ts
Error.constructor
```

## Properties

| Property | Type | Default value | Description | Overrides | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="name"></a> `name` | `string` | `'FetchError'` | The name of the error. | `Error.name` | [defines.ts:94](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/defines.ts#L94) |
| <a id="status-1"></a> `status` | `number` | `0` | The status code of the response. | - | [defines.ts:98](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/defines.ts#L98) |
