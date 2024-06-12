[**@happy-ts/fetch-t**](../README.md) • **Docs**

***

[@happy-ts/fetch-t](../README.md) / FetchInit

# Interface: FetchInit

Extends the standard `RequestInit` interface from the Fetch API to include additional custom options.

## Extends

- `RequestInit`

## Properties

| Property | Type | Description | Inherited from |
| :------ | :------ | :------ | :------ |
| `abortable?` | `boolean` | Indicates whether the fetch request should be abortable. | - |
| `body?` | `null` \| `BodyInit` | A BodyInit object or null to set request's body. | `RequestInit.body` |
| `cache?` | `RequestCache` | A string indicating how the request will interact with the browser's cache to set request's cache. | `RequestInit.cache` |
| `credentials?` | `RequestCredentials` | A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials. | `RequestInit.credentials` |
| `headers?` | `HeadersInit` | A Headers object, an object literal, or an array of two-item arrays to set request's headers. | `RequestInit.headers` |
| `integrity?` | `string` | A cryptographic hash of the resource to be fetched by request. Sets request's integrity. | `RequestInit.integrity` |
| `keepalive?` | `boolean` | A boolean to set request's keepalive. | `RequestInit.keepalive` |
| `method?` | `string` | A string to set request's method. | `RequestInit.method` |
| `mode?` | `RequestMode` | A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. | `RequestInit.mode` |
| `priority?` | `RequestPriority` | - | `RequestInit.priority` |
| `redirect?` | `RequestRedirect` | A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect. | `RequestInit.redirect` |
| `referrer?` | `string` | A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer. | `RequestInit.referrer` |
| `referrerPolicy?` | `ReferrerPolicy` | A referrer policy to set request's referrerPolicy. | `RequestInit.referrerPolicy` |
| `responseType?` | `"text"` \| `"arraybuffer"` \| `"blob"` \| `"json"` | Specifies the expected response type of the fetch request. | - |
| `signal?` | `null` \| `AbortSignal` | An AbortSignal to set request's signal. | `RequestInit.signal` |
| `window?` | `null` | Can only be null. Used to disassociate request from any Window. | `RequestInit.window` |
