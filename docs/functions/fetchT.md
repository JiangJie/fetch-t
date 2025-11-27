[**@happy-ts/fetch-t**](../README.md)

***

[@happy-ts/fetch-t](../README.md) / fetchT

# Function: fetchT()

Fetches a resource from the network and returns either a `FetchTask` or `FetchResponse` based on the provided options.

## Type Param

The expected type of the response data when not using a specific `responseType`.

## Param

The resource to fetch. Can be a URL object or a string representing a URL.

## Param

Additional options for the fetch operation, including custom `FetchInit` properties.

## Call Signature

```ts
function fetchT(url, init): FetchTask<string>
```

Defined in: [fetch.ts:14](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/fetch.ts#L14)

Fetches a resource from the network as a text string and returns a `FetchTask` representing the operation.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `abortable`: `true`; `responseType`: `"text"`; \} | Additional options for the fetch operation, including custom `FetchInit` properties. |

### Returns

[`FetchTask`](../interfaces/FetchTask.md)\<`string`\>

A `FetchTask` or `FetchResponse` depending on the provided options in `init`.

A `FetchTask` representing the operation with a `string` response.

### Type Param

The expected type of the response data when not using a specific `responseType`.

### Param

The resource to fetch. Can be a URL object or a string representing a URL.

### Param

Additional options for the fetch operation, including custom `FetchInit` properties.

## Call Signature

```ts
function fetchT(url, init): FetchTask<ArrayBuffer>
```

Defined in: [fetch.ts:26](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/fetch.ts#L26)

Fetches a resource from the network as an ArrayBuffer and returns a `FetchTask` representing the operation.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `abortable`: `true`; `responseType`: `"arraybuffer"`; \} | Additional options for the fetch operation, including custom `FetchInit` properties. |

### Returns

[`FetchTask`](../interfaces/FetchTask.md)\<`ArrayBuffer`\>

A `FetchTask` or `FetchResponse` depending on the provided options in `init`.

A `FetchTask` representing the operation with an `ArrayBuffer` response.

### Type Param

The expected type of the response data when not using a specific `responseType`.

### Param

The resource to fetch. Can be a URL object or a string representing a URL.

### Param

Additional options for the fetch operation, including custom `FetchInit` properties.

## Call Signature

```ts
function fetchT(url, init): FetchTask<Blob>
```

Defined in: [fetch.ts:38](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/fetch.ts#L38)

Fetches a resource from the network as a Blob and returns a `FetchTask` representing the operation.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `abortable`: `true`; `responseType`: `"blob"`; \} | Additional options for the fetch operation, including custom `FetchInit` properties. |

### Returns

[`FetchTask`](../interfaces/FetchTask.md)\<`Blob`\>

A `FetchTask` or `FetchResponse` depending on the provided options in `init`.

A `FetchTask` representing the operation with a `Blob` response.

### Type Param

The expected type of the response data when not using a specific `responseType`.

### Param

The resource to fetch. Can be a URL object or a string representing a URL.

### Param

Additional options for the fetch operation, including custom `FetchInit` properties.

## Call Signature

```ts
function fetchT<T>(url, init): FetchTask<T>
```

Defined in: [fetch.ts:51](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/fetch.ts#L51)

Fetches a resource from the network and parses it as JSON, returning a `FetchTask` representing the operation.

### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The expected type of the parsed JSON data. |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `abortable`: `true`; `responseType`: `"json"`; \} | Additional options for the fetch operation, including custom `FetchInit` properties. |

### Returns

[`FetchTask`](../interfaces/FetchTask.md)\<`T`\>

A `FetchTask` or `FetchResponse` depending on the provided options in `init`.

A `FetchTask` representing the operation with a response parsed as JSON.

### Type Param

The expected type of the response data when not using a specific `responseType`.

### Param

The resource to fetch. Can be a URL object or a string representing a URL.

### Param

Additional options for the fetch operation, including custom `FetchInit` properties.

## Call Signature

```ts
function fetchT(url, init): FetchResponse<string, Error>
```

Defined in: [fetch.ts:63](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/fetch.ts#L63)

Fetches a resource from the network as a text string and returns a `FetchResponse` representing the operation.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `responseType`: `"text"`; \} | Additional options for the fetch operation, specifying the response type as 'text'. |

### Returns

[`FetchResponse`](../type-aliases/FetchResponse.md)\<`string`, `Error`\>

A `FetchTask` or `FetchResponse` depending on the provided options in `init`.

A `FetchResponse` representing the operation with a `string` response.

### Type Param

The expected type of the response data when not using a specific `responseType`.

### Param

The resource to fetch. Can be a URL object or a string representing a URL.

### Param

Additional options for the fetch operation, including custom `FetchInit` properties.

## Call Signature

```ts
function fetchT(url, init): FetchResponse<ArrayBuffer, Error>
```

Defined in: [fetch.ts:74](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/fetch.ts#L74)

Fetches a resource from the network as an ArrayBuffer and returns a `FetchResponse` representing the operation.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `responseType`: `"arraybuffer"`; \} | Additional options for the fetch operation, specifying the response type as 'arraybuffer'. |

### Returns

[`FetchResponse`](../type-aliases/FetchResponse.md)\<`ArrayBuffer`, `Error`\>

A `FetchTask` or `FetchResponse` depending on the provided options in `init`.

A `FetchResponse` representing the operation with an `ArrayBuffer` response.

### Type Param

The expected type of the response data when not using a specific `responseType`.

### Param

The resource to fetch. Can be a URL object or a string representing a URL.

### Param

Additional options for the fetch operation, including custom `FetchInit` properties.

## Call Signature

```ts
function fetchT(url, init): FetchResponse<Blob, Error>
```

Defined in: [fetch.ts:85](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/fetch.ts#L85)

Fetches a resource from the network as a Blob and returns a `FetchResponse` representing the operation.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `responseType`: `"blob"`; \} | Additional options for the fetch operation, specifying the response type as 'blob'. |

### Returns

[`FetchResponse`](../type-aliases/FetchResponse.md)\<`Blob`, `Error`\>

A `FetchTask` or `FetchResponse` depending on the provided options in `init`.

A `FetchResponse` representing the operation with a `Blob` response.

### Type Param

The expected type of the response data when not using a specific `responseType`.

### Param

The resource to fetch. Can be a URL object or a string representing a URL.

### Param

Additional options for the fetch operation, including custom `FetchInit` properties.

## Call Signature

```ts
function fetchT<T>(url, init): FetchResponse<T, Error>
```

Defined in: [fetch.ts:97](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/fetch.ts#L97)

Fetches a resource from the network and parses it as JSON, returning a `FetchResponse` representing the operation.

### Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` | The expected type of the parsed JSON data. |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `responseType`: `"json"`; \} | Additional options for the fetch operation, specifying the response type as 'json'. |

### Returns

[`FetchResponse`](../type-aliases/FetchResponse.md)\<`T`, `Error`\>

A `FetchTask` or `FetchResponse` depending on the provided options in `init`.

A `FetchResponse` representing the operation with a response parsed as JSON.

### Type Param

The expected type of the response data when not using a specific `responseType`.

### Param

The resource to fetch. Can be a URL object or a string representing a URL.

### Param

Additional options for the fetch operation, including custom `FetchInit` properties.

## Call Signature

```ts
function fetchT(url, init): FetchTask<Response>
```

Defined in: [fetch.ts:108](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/fetch.ts#L108)

Fetches a resource from the network and returns a `FetchTask` representing the operation with a generic `Response`.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init` | [`FetchInit`](../interfaces/FetchInit.md) & \{ `abortable`: `true`; \} | Additional options for the fetch operation, indicating that the operation should be abortable. |

### Returns

[`FetchTask`](../interfaces/FetchTask.md)\<`Response`\>

A `FetchTask` or `FetchResponse` depending on the provided options in `init`.

A `FetchTask` representing the operation with a generic `Response`.

### Type Param

The expected type of the response data when not using a specific `responseType`.

### Param

The resource to fetch. Can be a URL object or a string representing a URL.

### Param

Additional options for the fetch operation, including custom `FetchInit` properties.

## Call Signature

```ts
function fetchT(url, init?): FetchResponse<Response>
```

Defined in: [fetch.ts:120](https://github.com/JiangJie/fetch-t/blob/bef789cb418392a07597af77b2942bea27482d3e/src/fetch/fetch.ts#L120)

Fetches a resource from the network and returns a `FetchResponse` or `FetchTask` based on the provided options.

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `url` | `string` \| `URL` | The resource to fetch. Can be a URL object or a string representing a URL. |
| `init`? | [`FetchInit`](../interfaces/FetchInit.md) | Additional options for the fetch operation, including custom `FetchInit` properties. |

### Returns

[`FetchResponse`](../type-aliases/FetchResponse.md)\<`Response`\>

A `FetchTask` or `FetchResponse` depending on the provided options in `init`.

A `FetchResponse` representing the operation with a `Response` object.

### Type Param

The expected type of the response data when not using a specific `responseType`.

### Param

The resource to fetch. Can be a URL object or a string representing a URL.

### Param

Additional options for the fetch operation, including custom `FetchInit` properties.
