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
| `abortable?` | `boolean` | Indicates whether the fetch request should be abortable. | [defines.ts:47](https://github.com/JiangJie/fetch-t/blob/6db6e6bc264d2c2e0afd8a65220e2640b742b88b/src/fetch/defines.ts#L47) |
| `responseType?` | [`FetchResponseType`](../type-aliases/FetchResponseType.md) | Specifies the expected response type of the fetch request. | [defines.ts:52](https://github.com/JiangJie/fetch-t/blob/6db6e6bc264d2c2e0afd8a65220e2640b742b88b/src/fetch/defines.ts#L52) |
| `timeout?` | `number` | Specifies the maximum time in milliseconds to wait for the fetch request to complete. | [defines.ts:57](https://github.com/JiangJie/fetch-t/blob/6db6e6bc264d2c2e0afd8a65220e2640b742b88b/src/fetch/defines.ts#L57) |
