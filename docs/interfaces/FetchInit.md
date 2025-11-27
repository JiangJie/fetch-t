[**@happy-ts/fetch-t**](../README.md)

***

[@happy-ts/fetch-t](../README.md) / FetchInit

# Interface: FetchInit

Defined in: [defines.ts:58](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/defines.ts#L58)

Extends the standard `RequestInit` interface from the Fetch API to include additional custom options.

## Extends

- `RequestInit`

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="abortable"></a> `abortable?` | `boolean` | Indicates whether the fetch request should be abortable. | [defines.ts:62](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/defines.ts#L62) |
| <a id="onchunk"></a> `onChunk?` | (`chunk`: `Uint8Array`) => `void` | Specifies a function to be called when the fetch request receives a chunk of data. | [defines.ts:84](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/defines.ts#L84) |
| <a id="onprogress"></a> `onProgress?` | (`progressResult`: `IOResult`\<[`FetchProgress`](FetchProgress.md)\>) => `void` | Specifies a function to be called when the fetch request makes progress. | [defines.ts:78](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/defines.ts#L78) |
| <a id="responsetype"></a> `responseType?` | [`FetchResponseType`](../type-aliases/FetchResponseType.md) | Specifies the expected response type of the fetch request. | [defines.ts:67](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/defines.ts#L67) |
| <a id="timeout"></a> `timeout?` | `number` | Specifies the maximum time in milliseconds to wait for the fetch request to complete. | [defines.ts:72](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/defines.ts#L72) |
