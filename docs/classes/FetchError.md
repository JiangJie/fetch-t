[**@happy-ts/fetch-t**](../README.md) • **Docs**

***

[@happy-ts/fetch-t](../README.md) / FetchError

# Class: FetchError

Represents an error that occurred during a fetch operation when the response is not ok.

## Extends

- `Error`

## Constructors

### new FetchError()

```ts
new FetchError(message, status): FetchError
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `message` | `string` |
| `status` | `number` |

#### Returns

[`FetchError`](FetchError.md)

#### Overrides

`Error.constructor`

#### Defined in

[defines.ts:73](https://github.com/JiangJie/fetch-t/blob/8806bee244ff033abe18991d72f4e6f862cf2c99/src/fetch/defines.ts#L73)

## Properties

| Property | Type | Default value | Description | Overrides | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `name` | `string` | `'FetchError'` | The name of the error. | `Error.name` | [defines.ts:67](https://github.com/JiangJie/fetch-t/blob/8806bee244ff033abe18991d72f4e6f862cf2c99/src/fetch/defines.ts#L67) |
| `status` | `number` | `0` | The status code of the response. | - | [defines.ts:71](https://github.com/JiangJie/fetch-t/blob/8806bee244ff033abe18991d72f4e6f862cf2c99/src/fetch/defines.ts#L71) |
