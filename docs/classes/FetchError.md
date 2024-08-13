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

[defines.ts:100](https://github.com/JiangJie/fetch-t/blob/61346c95bab5342bcbd9e97bca747ef24af2eac6/src/fetch/defines.ts#L100)

## Properties

| Property | Type | Default value | Description | Overrides | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `name` | `string` | `'FetchError'` | The name of the error. | `Error.name` | [defines.ts:94](https://github.com/JiangJie/fetch-t/blob/61346c95bab5342bcbd9e97bca747ef24af2eac6/src/fetch/defines.ts#L94) |
| `status` | `number` | `0` | The status code of the response. | - | [defines.ts:98](https://github.com/JiangJie/fetch-t/blob/61346c95bab5342bcbd9e97bca747ef24af2eac6/src/fetch/defines.ts#L98) |
