[**@happy-ts/fetch-t**](../index.md) • **Docs**

***

[@happy-ts/fetch-t](../index.md) / fetchT

# Function: fetchT()

## fetchT(url, init)

```ts
function fetchT(url, init): FetchTask<string>
```

Fetches a resource from the network as a text string and returns a `FetchTask` representing the operation.

### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `abortable`: `true`; `responseType`: `"text"`; \} | Additional options for the fetch operation, including custom `FetchInit` properties. |

### Returns

[`FetchTask`](../interfaces/FetchTask.md)\<`string`\>

A `FetchTask` representing the operation with a `string` response.

### Source

[src/fetch/fetch.ts:14](https://github.com/JiangJie/fetch-t/blob/5ca54f90db4fac871c3148a812ceaa65b2b2c097/src/fetch/fetch.ts#L14)

## fetchT(url, init)

```ts
function fetchT(url, init): FetchTask<ArrayBuffer>
```

Fetches a resource from the network as an ArrayBuffer and returns a `FetchTask` representing the operation.

### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `abortable`: `true`; `responseType`: `"arraybuffer"`; \} | Additional options for the fetch operation, including custom `FetchInit` properties. |

### Returns

[`FetchTask`](../interfaces/FetchTask.md)\<`ArrayBuffer`\>

A `FetchTask` representing the operation with an `ArrayBuffer` response.

### Source

[src/fetch/fetch.ts:26](https://github.com/JiangJie/fetch-t/blob/5ca54f90db4fac871c3148a812ceaa65b2b2c097/src/fetch/fetch.ts#L26)

## fetchT(url, init)

```ts
function fetchT(url, init): FetchTask<Blob>
```

Fetches a resource from the network as a Blob and returns a `FetchTask` representing the operation.

### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `abortable`: `true`; `responseType`: `"blob"`; \} | Additional options for the fetch operation, including custom `FetchInit` properties. |

### Returns

[`FetchTask`](../interfaces/FetchTask.md)\<`Blob`\>

A `FetchTask` representing the operation with a `Blob` response.

### Source

[src/fetch/fetch.ts:38](https://github.com/JiangJie/fetch-t/blob/5ca54f90db4fac871c3148a812ceaa65b2b2c097/src/fetch/fetch.ts#L38)

## fetchT(url, init)

```ts
function fetchT<T>(url, init): FetchTask<T>
```

Fetches a resource from the network and parses it as JSON, returning a `FetchTask` representing the operation.

### Type parameters

| Type parameter | Description |
| :------ | :------ |
| `T` | The expected type of the parsed JSON data. |

### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `abortable`: `true`; `responseType`: `"json"`; \} | Additional options for the fetch operation, including custom `FetchInit` properties. |

### Returns

[`FetchTask`](../interfaces/FetchTask.md)\<`T`\>

A `FetchTask` representing the operation with a response parsed as JSON.

### Source

[src/fetch/fetch.ts:51](https://github.com/JiangJie/fetch-t/blob/5ca54f90db4fac871c3148a812ceaa65b2b2c097/src/fetch/fetch.ts#L51)

## fetchT(url, init)

```ts
function fetchT(url, init): FetchResponse<string>
```

Fetches a resource from the network as a text string and returns a `FetchResponse` representing the operation.

### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `responseType`: `"text"`; \} | Additional options for the fetch operation, specifying the response type as 'text'. |

### Returns

[`FetchResponse`](../type-aliases/FetchResponse.md)\<`string`\>

A `FetchResponse` representing the operation with a `string` response.

### Source

[src/fetch/fetch.ts:63](https://github.com/JiangJie/fetch-t/blob/5ca54f90db4fac871c3148a812ceaa65b2b2c097/src/fetch/fetch.ts#L63)

## fetchT(url, init)

```ts
function fetchT(url, init): FetchResponse<ArrayBuffer>
```

Fetches a resource from the network as an ArrayBuffer and returns a `FetchResponse` representing the operation.

### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `responseType`: `"arraybuffer"`; \} | Additional options for the fetch operation, specifying the response type as 'arraybuffer'. |

### Returns

[`FetchResponse`](../type-aliases/FetchResponse.md)\<`ArrayBuffer`\>

A `FetchResponse` representing the operation with an `ArrayBuffer` response.

### Source

[src/fetch/fetch.ts:74](https://github.com/JiangJie/fetch-t/blob/5ca54f90db4fac871c3148a812ceaa65b2b2c097/src/fetch/fetch.ts#L74)

## fetchT(url, init)

```ts
function fetchT(url, init): FetchResponse<Blob>
```

Fetches a resource from the network as a Blob and returns a `FetchResponse` representing the operation.

### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `responseType`: `"blob"`; \} | Additional options for the fetch operation, specifying the response type as 'blob'. |

### Returns

[`FetchResponse`](../type-aliases/FetchResponse.md)\<`Blob`\>

A `FetchResponse` representing the operation with a `Blob` response.

### Source

[src/fetch/fetch.ts:85](https://github.com/JiangJie/fetch-t/blob/5ca54f90db4fac871c3148a812ceaa65b2b2c097/src/fetch/fetch.ts#L85)

## fetchT(url, init)

```ts
function fetchT<T>(url, init): FetchResponse<T>
```

Fetches a resource from the network and parses it as JSON, returning a `FetchResponse` representing the operation.

### Type parameters

| Type parameter | Description |
| :------ | :------ |
| `T` | The expected type of the parsed JSON data. |

### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `responseType`: `"json"`; \} | Additional options for the fetch operation, specifying the response type as 'json'. |

### Returns

[`FetchResponse`](../type-aliases/FetchResponse.md)\<`T`\>

A `FetchResponse` representing the operation with a response parsed as JSON.

### Source

[src/fetch/fetch.ts:97](https://github.com/JiangJie/fetch-t/blob/5ca54f90db4fac871c3148a812ceaa65b2b2c097/src/fetch/fetch.ts#L97)

## fetchT(url, init)

```ts
function fetchT(url, init): FetchTask<Response>
```

Fetches a resource from the network and returns a `FetchTask` representing the operation with a generic `Response`.

### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `abortable`: `true`; \} | Additional options for the fetch operation, indicating that the operation should be abortable. |

### Returns

[`FetchTask`](../interfaces/FetchTask.md)\<`Response`\>

A `FetchTask` representing the operation with a generic `Response`.

### Source

[src/fetch/fetch.ts:108](https://github.com/JiangJie/fetch-t/blob/5ca54f90db4fac871c3148a812ceaa65b2b2c097/src/fetch/fetch.ts#L108)

## fetchT(url, init)

```ts
function fetchT(url, init): FetchResponse<Response>
```

Fetches a resource from the network and returns a `FetchResponse` representing the operation with a generic `Response`.

### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `abortable`: `false`; \} | Additional options for the fetch operation, indicating that the operation should not be abortable. |

### Returns

[`FetchResponse`](../type-aliases/FetchResponse.md)\<`Response`\>

A `FetchResponse` representing the operation with a generic `Response`.

### Source

[src/fetch/fetch.ts:119](https://github.com/JiangJie/fetch-t/blob/5ca54f90db4fac871c3148a812ceaa65b2b2c097/src/fetch/fetch.ts#L119)

## fetchT(url, init)

```ts
function fetchT<T>(url, init): FetchTask<T> | FetchResponse<T>
```

Fetches a resource from the network and returns a `FetchResponse` or `FetchTask` based on the provided options.

### Type parameters

| Type parameter | Description |
| :------ | :------ |
| `T` | The expected type of the response data when not using a specific `responseType`. |

### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) | Additional options for the fetch operation, including custom `FetchInit` properties. |

### Returns

[`FetchTask`](../interfaces/FetchTask.md)\<`T`\> \| [`FetchResponse`](../type-aliases/FetchResponse.md)\<`T`\>

A `FetchResponse` or `FetchTask` depending on the `abortable` option in `init`.

### Source

[src/fetch/fetch.ts:131](https://github.com/JiangJie/fetch-t/blob/5ca54f90db4fac871c3148a812ceaa65b2b2c097/src/fetch/fetch.ts#L131)

## fetchT(url, init)

```ts
function fetchT(url, init?): FetchResponse<Response>
```

Fetches a resource from the network and returns a `FetchResponse` representing the operation.

### Parameters

| Parameter | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init`? | `RequestInit` | Standard `RequestInit` options for the fetch operation. |

### Returns

[`FetchResponse`](../type-aliases/FetchResponse.md)\<`Response`\>

A `FetchResponse` representing the operation with a `Response` object.

### Source

[src/fetch/fetch.ts:140](https://github.com/JiangJie/fetch-t/blob/5ca54f90db4fac871c3148a812ceaa65b2b2c097/src/fetch/fetch.ts#L140)
