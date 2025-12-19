import { Err, Ok } from 'happy-rusty';
import invariant from 'tiny-invariant';
import { TIMEOUT_ERROR } from './constants.ts';
import { FetchError, type FetchInit, type FetchResponse, type FetchTask } from './defines.ts';

/**
 * Fetches a resource from the network as a text string and returns an abortable `FetchTask`.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `abortable: true` and `responseType: 'text'`.
 * @returns A `FetchTask` representing the abortable operation with a `string` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'text';
}): FetchTask<string>;

/**
 * Fetches a resource from the network as an ArrayBuffer and returns an abortable `FetchTask`.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `abortable: true` and `responseType: 'arraybuffer'`.
 * @returns A `FetchTask` representing the abortable operation with an `ArrayBuffer` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'arraybuffer';
}): FetchTask<ArrayBuffer>;

/**
 * Fetches a resource from the network as a Blob and returns an abortable `FetchTask`.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `abortable: true` and `responseType: 'blob'`.
 * @returns A `FetchTask` representing the abortable operation with a `Blob` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'blob';
}): FetchTask<Blob>;

/**
 * Fetches a resource from the network and parses it as JSON, returning an abortable `FetchTask`.
 *
 * @typeParam T - The expected type of the parsed JSON data.
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `abortable: true` and `responseType: 'json'`.
 * @returns A `FetchTask` representing the abortable operation with a response parsed as type `T`.
 */
export function fetchT<T>(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'json';
}): FetchTask<T>;

/**
 * Fetches a resource from the network as a text string.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `responseType: 'text'`.
 * @returns A `FetchResponse` representing the operation with a `string` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    responseType: 'text';
}): FetchResponse<string, Error>;

/**
 * Fetches a resource from the network as an ArrayBuffer.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `responseType: 'arraybuffer'`.
 * @returns A `FetchResponse` representing the operation with an `ArrayBuffer` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    responseType: 'arraybuffer';
}): FetchResponse<ArrayBuffer, Error>;

/**
 * Fetches a resource from the network as a Blob.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `responseType: 'blob'`.
 * @returns A `FetchResponse` representing the operation with a `Blob` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    responseType: 'blob';
}): FetchResponse<Blob, Error>;

/**
 * Fetches a resource from the network and parses it as JSON.
 *
 * @typeParam T - The expected type of the parsed JSON data.
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `responseType: 'json'`.
 * @returns A `FetchResponse` representing the operation with a response parsed as type `T`.
 */
export function fetchT<T>(url: string | URL, init: FetchInit & {
    responseType: 'json';
}): FetchResponse<T, Error>;

/**
 * Fetches a resource from the network and returns an abortable `FetchTask` with a generic `Response`.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `abortable: true`.
 * @returns A `FetchTask` representing the abortable operation with a `Response` object.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
}): FetchTask<Response>;

/**
 * Fetches a resource from the network and returns a `FetchResponse` with a generic `Response` object.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Optional additional options for the fetch operation.
 * @returns A `FetchResponse` representing the operation with a `Response` object.
 */
export function fetchT(url: string | URL, init?: FetchInit): FetchResponse<Response>;

/**
 * Enhanced fetch function that wraps the native Fetch API with additional capabilities.
 *
 * Features:
 * - **Abortable requests**: Set `abortable: true` to get a `FetchTask` with `abort()` method.
 * - **Type-safe responses**: Use `responseType` to automatically parse responses as text, JSON, ArrayBuffer, or Blob.
 * - **Timeout support**: Set `timeout` in milliseconds to auto-abort long-running requests.
 * - **Progress tracking**: Use `onProgress` callback to track download progress (requires Content-Length header).
 * - **Chunk streaming**: Use `onChunk` callback to receive raw data chunks as they arrive.
 * - **Result type error handling**: Returns `Result<T, Error>` instead of throwing exceptions.
 *
 * @typeParam T - The expected type of the response data.
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, extending standard `RequestInit` with custom properties.
 * @returns A `FetchTask<T>` if `abortable: true`, otherwise a `FetchResponse<T>` (which is `AsyncResult<T, Error>`).
 * @throws {Error} If `url` is not a string or URL object.
 * @throws {Error} If `timeout` is specified but is not a positive number.
 *
 * @example
 * // Basic GET request - returns Response object wrapped in Result
 * const result = await fetchT('https://api.example.com/data');
 * result
 *     .inspect((res) => console.log('Status:', res.status))
 *     .inspectErr((err) => console.error('Error:', err));
 *
 * @example
 * // GET JSON with type safety
 * interface User {
 *     id: number;
 *     name: string;
 * }
 * const result = await fetchT<User>('https://api.example.com/user/1', {
 *     responseType: 'json',
 * });
 * result.inspect((user) => console.log(user.name));
 *
 * @example
 * // POST request with JSON body
 * const result = await fetchT<User>('https://api.example.com/users', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ name: 'John' }),
 *     responseType: 'json',
 * });
 *
 * @example
 * // Abortable request with timeout
 * const task = fetchT('https://api.example.com/data', {
 *     abortable: true,
 *     timeout: 5000, // 5 seconds
 * });
 *
 * // Cancel the request if needed
 * task.abort('User cancelled');
 *
 * // Check if aborted
 * console.log('Aborted:', task.aborted);
 *
 * // Wait for response
 * const result = await task.response;
 *
 * @example
 * // Track download progress
 * const result = await fetchT('https://example.com/large-file.zip', {
 *     responseType: 'blob',
 *     onProgress: (progressResult) => {
 *         progressResult
 *             .inspect(({ completedByteLength, totalByteLength }) => {
 *                 const percent = ((completedByteLength / totalByteLength) * 100).toFixed(1);
 *                 console.log(`Progress: ${percent}%`);
 *             })
 *             .inspectErr((err) => console.warn('Progress unavailable:', err.message));
 *     },
 * });
 *
 * @example
 * // Stream data chunks
 * const chunks: Uint8Array[] = [];
 * const result = await fetchT('https://example.com/stream', {
 *     onChunk: (chunk) => chunks.push(chunk),
 * });
 */
export function fetchT<T>(url: string | URL, init?: FetchInit): FetchTask<T> | FetchResponse<T> {
    // Fast path: most URLs are passed as strings
    if (typeof url !== 'string') {
        invariant(url instanceof URL, () => `Url must be a string or URL object but received ${ url }.`);
    }

    const {
        // default not abortable
        abortable = false,
        responseType,
        timeout,
        onProgress,
        onChunk,
        ...rest
    } = init ?? {};

    const shouldWaitTimeout = timeout != null;
    let cancelTimer: (() => void) | null;

    if (shouldWaitTimeout) {
        invariant(typeof timeout === 'number' && timeout > 0, () => `Timeout must be a number greater than 0 but received ${ timeout }.`);
    }

    let controller: AbortController;

    if (abortable || shouldWaitTimeout) {
        controller = new AbortController();
        rest.signal = controller.signal;
    }

    const response: FetchResponse<T> = fetch(url, rest).then(async (res): FetchResponse<T> => {
        cancelTimer?.();

        if (!res.ok) {
            await res.body?.cancel();
            return Err(new FetchError(res.statusText, res.status));
        }

        if (res.body) {
            // should notify progress or data chunk?
            const shouldNotifyProgress = typeof onProgress === 'function';
            const shouldNotifyChunk = typeof onChunk === 'function';

            if ((shouldNotifyProgress || shouldNotifyChunk)) {
                // tee the original stream to two streams, one for notify progress, another for response
                const [stream1, stream2] = res.body.tee();

                const reader = stream1.getReader();
                // Content-Length may not be present in response headers
                let totalByteLength: number | null = null;
                let completedByteLength = 0;

                if (shouldNotifyProgress) {
                    // Headers.get() is case-insensitive per spec
                    const contentLength = res.headers.get('content-length');
                    if (contentLength == null) {
                        // response headers has no content-length
                        onProgress(Err(new Error('No content-length in response headers.')));
                    } else {
                        totalByteLength = parseInt(contentLength, 10);
                    }
                }

                reader.read().then(function notify({ done, value }) {
                    if (done) {
                        return;
                    }

                    // notify chunk
                    if (shouldNotifyChunk) {
                        onChunk(value);
                    }

                    // notify progress
                    if (shouldNotifyProgress && totalByteLength != null) {
                        completedByteLength += value.byteLength;
                        onProgress(Ok({
                            totalByteLength,
                            completedByteLength,
                        }));
                    }

                    // Continue reading the stream
                    reader.read().then(notify);
                });

                // replace the original response with the new one
                res = new Response(stream2, {
                    headers: res.headers,
                    status: res.status,
                    statusText: res.statusText,
                });
            }
        }

        switch (responseType) {
            case 'arraybuffer': {
                return Ok(await res.arrayBuffer() as T);
            }
            case 'blob': {
                return Ok(await res.blob() as T);
            }
            case 'json': {
                try {
                    return Ok(await res.json() as T);
                } catch {
                    return Err(new Error('Response is invalid json while responseType is json'));
                }
            }
            case 'text': {
                return Ok(await res.text() as T);
            }
            default: {
                // default return the Response object
                return Ok(res as T);
            }
        }
    }).catch((err) => {
        cancelTimer?.();

        return Err(err);
    });

    if (shouldWaitTimeout) {
        const timer = setTimeout(() => {
            const error = new Error();
            error.name = TIMEOUT_ERROR;
            controller.abort(error);
        }, timeout);

        cancelTimer = (): void => {
            clearTimeout(timer);
            cancelTimer = null;
        };
    }

    if (abortable) {
        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            abort(reason?: any): void {
                cancelTimer?.();
                controller.abort(reason);
            },

            get aborted(): boolean {
                return controller.signal.aborted;
            },

            get response(): FetchResponse<T> {
                return response;
            },
        };
    }

    return response;
}