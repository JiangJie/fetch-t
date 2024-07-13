[**@happy-ts/fetch-t**](../README.md) • **Docs**

***

[@happy-ts/fetch-t](../README.md) / FetchInit

# Interface: FetchInit

Extends the standard `RequestInit` interface from the Fetch API to include additional custom options.

## Extends

- `RequestInit`

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `abortable?` | `boolean` | Indicates whether the fetch request should be abortable. | - | [src/fetch/defines.ts:42](https://github.com/JiangJie/fetch-t/blob/9e5c4ce034f7bf6add07f55044bccbb16a68960c/src/fetch/defines.ts#L42) |
| `body?` | `null` \| `BodyInit` | A BodyInit object or null to set request's body. | `RequestInit.body` | node\_modules/.deno/typescript@5.5.3/node\_modules/typescript/lib/lib.dom.d.ts:1693 |
| `cache?` | `RequestCache` | A string indicating how the request will interact with the browser's cache to set request's cache. | `RequestInit.cache` | node\_modules/.deno/typescript@5.5.3/node\_modules/typescript/lib/lib.dom.d.ts:1695 |
| `credentials?` | `RequestCredentials` | A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials. | `RequestInit.credentials` | node\_modules/.deno/typescript@5.5.3/node\_modules/typescript/lib/lib.dom.d.ts:1697 |
| `headers?` | `HeadersInit` | A Headers object, an object literal, or an array of two-item arrays to set request's headers. | `RequestInit.headers` | node\_modules/.deno/typescript@5.5.3/node\_modules/typescript/lib/lib.dom.d.ts:1699 |
| `integrity?` | `string` | A cryptographic hash of the resource to be fetched by request. Sets request's integrity. | `RequestInit.integrity` | node\_modules/.deno/typescript@5.5.3/node\_modules/typescript/lib/lib.dom.d.ts:1701 |
| `keepalive?` | `boolean` | A boolean to set request's keepalive. | `RequestInit.keepalive` | node\_modules/.deno/typescript@5.5.3/node\_modules/typescript/lib/lib.dom.d.ts:1703 |
| `method?` | `string` | A string to set request's method. | `RequestInit.method` | node\_modules/.deno/typescript@5.5.3/node\_modules/typescript/lib/lib.dom.d.ts:1705 |
| `mode?` | `RequestMode` | A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. | `RequestInit.mode` | node\_modules/.deno/typescript@5.5.3/node\_modules/typescript/lib/lib.dom.d.ts:1707 |
| `priority?` | `RequestPriority` | - | `RequestInit.priority` | node\_modules/.deno/typescript@5.5.3/node\_modules/typescript/lib/lib.dom.d.ts:1708 |
| `redirect?` | `RequestRedirect` | A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect. | `RequestInit.redirect` | node\_modules/.deno/typescript@5.5.3/node\_modules/typescript/lib/lib.dom.d.ts:1710 |
| `referrer?` | `string` | A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer. | `RequestInit.referrer` | node\_modules/.deno/typescript@5.5.3/node\_modules/typescript/lib/lib.dom.d.ts:1712 |
| `referrerPolicy?` | `ReferrerPolicy` | A referrer policy to set request's referrerPolicy. | `RequestInit.referrerPolicy` | node\_modules/.deno/typescript@5.5.3/node\_modules/typescript/lib/lib.dom.d.ts:1714 |
| `responseType?` | `"text"` \| `"arraybuffer"` \| `"blob"` \| `"json"` | Specifies the expected response type of the fetch request. | - | [src/fetch/defines.ts:47](https://github.com/JiangJie/fetch-t/blob/9e5c4ce034f7bf6add07f55044bccbb16a68960c/src/fetch/defines.ts#L47) |
| `signal?` | `null` \| `AbortSignal` | An AbortSignal to set request's signal. | `RequestInit.signal` | node\_modules/.deno/typescript@5.5.3/node\_modules/typescript/lib/lib.dom.d.ts:1716 |
| `window?` | `null` | Can only be null. Used to disassociate request from any Window. | `RequestInit.window` | node\_modules/.deno/typescript@5.5.3/node\_modules/typescript/lib/lib.dom.d.ts:1718 |
