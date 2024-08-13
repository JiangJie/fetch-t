[**@happy-ts/fetch-t**](../README.md) • **Docs**

***

[@happy-ts/fetch-t](../README.md) / FetchInit

# Interface: FetchInit

Extends the standard `RequestInit` interface from the Fetch API to include additional custom options.

## Extends

- `RequestInit`

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `abortable?` | `boolean` | Indicates whether the fetch request should be abortable. | [defines.ts:62](https://github.com/JiangJie/fetch-t/blob/61346c95bab5342bcbd9e97bca747ef24af2eac6/src/fetch/defines.ts#L62) |
| `onChunk?` | (`chunk`: `Uint8Array`) => `void` | Specifies a function to be called when the fetch request receives a chunk of data. | [defines.ts:84](https://github.com/JiangJie/fetch-t/blob/61346c95bab5342bcbd9e97bca747ef24af2eac6/src/fetch/defines.ts#L84) |
| `onProgress?` | (`progressResult`: `IOResult`\<[`FetchProgress`](FetchProgress.md)\>) => `void` | Specifies a function to be called when the fetch request makes progress. | [defines.ts:78](https://github.com/JiangJie/fetch-t/blob/61346c95bab5342bcbd9e97bca747ef24af2eac6/src/fetch/defines.ts#L78) |
| `responseType?` | [`FetchResponseType`](../type-aliases/FetchResponseType.md) | Specifies the expected response type of the fetch request. | [defines.ts:67](https://github.com/JiangJie/fetch-t/blob/61346c95bab5342bcbd9e97bca747ef24af2eac6/src/fetch/defines.ts#L67) |
| `timeout?` | `number` | Specifies the maximum time in milliseconds to wait for the fetch request to complete. | [defines.ts:72](https://github.com/JiangJie/fetch-t/blob/61346c95bab5342bcbd9e97bca747ef24af2eac6/src/fetch/defines.ts#L72) |
