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
| `abortable?` | `boolean` | Indicates whether the fetch request should be abortable. | [defines.ts:42](https://github.com/JiangJie/fetch-t/blob/9e5d8bc709fe9cc1630d97e0ca16ef403ee959bb/src/fetch/defines.ts#L42) |
| `responseType?` | `"text"` \| `"arraybuffer"` \| `"blob"` \| `"json"` | Specifies the expected response type of the fetch request. | [defines.ts:47](https://github.com/JiangJie/fetch-t/blob/9e5d8bc709fe9cc1630d97e0ca16ef403ee959bb/src/fetch/defines.ts#L47) |
| `timeout?` | `number` | Specifies the maximum time in milliseconds to wait for the fetch request to complete. | [defines.ts:52](https://github.com/JiangJie/fetch-t/blob/9e5d8bc709fe9cc1630d97e0ca16ef403ee959bb/src/fetch/defines.ts#L52) |
