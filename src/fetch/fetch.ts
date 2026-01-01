import { Err, Ok, type AsyncResult } from 'happy-rusty';
import invariant from 'tiny-invariant';
import { ABORT_ERROR, TIMEOUT_ERROR } from './constants.ts';
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
 * Fetches a resource from the network as a ReadableStream and returns an abortable `FetchTask`.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `abortable: true` and `responseType: 'stream'`.
 * @returns A `FetchTask` representing the abortable operation with a `ReadableStream<Uint8Array>` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'stream';
}): FetchTask<ReadableStream<Uint8Array>>;

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
 * Fetches a resource from the network as a ReadableStream.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `responseType: 'stream'`.
 * @returns A `FetchResponse` representing the operation with a `ReadableStream<Uint8Array>` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    responseType: 'stream';
}): FetchResponse<ReadableStream<Uint8Array>, Error>;

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
 * - **Retry support**: Use `retry` to automatically retry failed requests with configurable delay and conditions.
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
 *
 * @example
 * // Retry with exponential backoff
 * const result = await fetchT('https://api.example.com/data', {
 *     retry: {
 *         retries: 3,
 *         delay: (attempt) => Math.min(1000 * Math.pow(2, attempt - 1), 10000),
 *         when: [500, 502, 503, 504],
 *         onRetry: (error, attempt) => console.log(`Retry ${attempt}: ${error.message}`),
 *     },
 *     responseType: 'json',
 * });
 */
export function fetchT<T>(url: string | URL, init?: FetchInit): FetchTask<T> | FetchResponse<T> {
    // Fast path: most URLs are passed as strings
    if (typeof url !== 'string') {
        invariant(url instanceof URL, () => `Url must be a string or URL object but received ${ url }`);
    }

    const {
        // default not abortable
        abortable = false,
        responseType,
        timeout,
        retry: retryOptions = 0,
        onProgress,
        onChunk,
        ...rest
    } = init ?? {};

    const shouldWaitTimeout = timeout != null;
    if (shouldWaitTimeout) {
        invariant(typeof timeout === 'number' && timeout > 0, () => `Timeout must be a number greater than 0 but received ${ timeout }`);
    }

    // Parse retry options
    let retries = 0;
    let retryDelay: number | ((attempt: number) => number) = 0;
    let retryWhen: ((error: Error, attempt: number) => boolean) | number[] | undefined;
    let onRetry: ((error: Error, attempt: number) => void) | undefined;

    if (typeof retryOptions === 'number') {
        retries = retryOptions;
    } else if (retryOptions && typeof retryOptions === 'object') {
        retries = retryOptions.retries ?? 0;
        retryDelay = retryOptions.delay ?? 0;
        retryWhen = retryOptions.when;
        onRetry = retryOptions.onRetry;
    }
    invariant(Number.isInteger(retries) && retries >= 0, () => `Retry count must be a non-negative integer but received ${ retries }`);

    // Master controller for user abort (stops all retries)
    let masterController: AbortController | undefined;
    if (abortable) {
        masterController = new AbortController();
    }

    /**
     * Determines if the error should trigger a retry.
     * By default, only network errors (not FetchError) trigger retries.
     */
    const shouldRetry = (error: Error, attempt: number): boolean => {
        // Never retry on user abort
        if (error.name === ABORT_ERROR) {
            return false;
        }

        if (!retryWhen) {
            // Default: only retry on network errors (not FetchError/HTTP errors)
            return !(error instanceof FetchError);
        }

        if (Array.isArray(retryWhen)) {
            // Retry on specific HTTP status codes
            return error instanceof FetchError && retryWhen.includes(error.status);
        }

        // Custom retry condition
        return retryWhen(error, attempt);
    };

    /**
     * Calculates the delay before the next retry attempt.
     */
    const getRetryDelay = (attempt: number): number => {
        return typeof retryDelay === 'function'
            ? retryDelay(attempt)
            : retryDelay;
    };

    /**
     * Delays execution for the specified number of milliseconds.
     */
    const delay = (ms: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    /**
     * Performs a single fetch attempt with optional timeout.
     */
    const doFetch = async (): AsyncResult<T, Error> => {
        // Create a new controller for this attempt (for timeout)
        let attemptController: AbortController | undefined;
        let cancelTimer: (() => void) | null = null;
        let removeAbortListener: (() => void) | null = null;

        if (shouldWaitTimeout || masterController) {
            attemptController = new AbortController();
            rest.signal = attemptController.signal;

            // Link master controller to attempt controller
            if (masterController) {
                const controller = attemptController;
                const onAbort = () => {
                    controller.abort(masterController.signal.reason);
                };
                masterController.signal.addEventListener('abort', onAbort, { once: true });
                removeAbortListener = () => {
                    masterController.signal.removeEventListener('abort', onAbort);
                };
            }
        }

        // Setup timeout for this attempt
        if (shouldWaitTimeout && attemptController) {
            const controller = attemptController;
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

        try {
            const res = await fetch(url, rest);

            cancelTimer?.();
            removeAbortListener?.();

            if (!res.ok) {
                await res.body?.cancel();
                return Err(new FetchError(res.statusText, res.status));
            }

            let response = res;

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
                            try {
                                onProgress(Err(new Error('No content-length in response headers.')));
                            } catch {
                                // Silently ignore user callback errors
                            }
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
                            try {
                                onChunk(value);
                            } catch {
                                // Silently ignore user callback errors
                            }
                        }

                        // notify progress
                        if (shouldNotifyProgress && totalByteLength != null) {
                            completedByteLength += value.byteLength;
                            try {
                                onProgress(Ok({
                                    totalByteLength,
                                    completedByteLength,
                                }));
                            } catch {
                                // Silently ignore user callback errors
                            }
                        }

                        // Continue reading the stream
                        reader.read().then(notify).catch(() => {
                            // Silently ignore stream read errors (will be handled by main response)
                        });
                    }).catch(() => {
                        // Silently ignore initial stream read errors (will be handled by main response)
                    });

                    // replace the original response with the new one
                    response = new Response(stream2, {
                        headers: res.headers,
                        status: res.status,
                        statusText: res.statusText,
                    });
                }
            }

            switch (responseType) {
                case 'arraybuffer': {
                    return Ok(await response.arrayBuffer() as T);
                }
                case 'blob': {
                    return Ok(await response.blob() as T);
                }
                case 'json': {
                    try {
                        return Ok(await response.json() as T);
                    } catch {
                        return Err(new Error('Response is invalid json while responseType is json'));
                    }
                }
                case 'stream': {
                    return Ok(response.body as T);
                }
                case 'text': {
                    return Ok(await response.text() as T);
                }
                default: {
                    // default return the Response object
                    return Ok(response as T);
                }
            }
        } catch (err) {
            cancelTimer?.();
            removeAbortListener?.();
            return Err(err as Error);
        }
    };

    /**
     * Performs fetch with retry logic.
     */
    const fetchWithRetry = async (): FetchResponse<T> => {
        let lastError: Error = new Error('Unknown error');
        let attempt = 0;

        do {
            // Before retry (not first attempt), call onRetry and wait for delay
            if (attempt > 0) {
                // Check if user aborted before retry
                if (masterController?.signal.aborted) {
                    const error = new Error('Aborted');
                    error.name = ABORT_ERROR;
                    return Err(error);
                }

                try {
                    onRetry?.(lastError, attempt);
                } catch {
                    // Silently ignore user callback errors
                }

                const delayMs = getRetryDelay(attempt);
                // Wait for delay if necessary
                if (delayMs > 0) {
                    await delay(delayMs);
                }

                // Check again after delay in case user aborted during delay
                if (masterController?.signal.aborted) {
                    const error = new Error('Aborted');
                    error.name = ABORT_ERROR;
                    return Err(error);
                }
            }

            const result = await doFetch();

            if (result.isOk()) {
                return result;
            }

            lastError = result.unwrapErr();
            attempt++;

            // Check if we should retry
        } while (attempt <= retries && shouldRetry(lastError, attempt));

        // No more retries or should not retry
        return Err(lastError);
    };

    const response = fetchWithRetry();

    if (abortable && masterController) {
        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            abort(reason?: any): void {
                masterController.abort(reason);
            },

            get aborted(): boolean {
                return masterController.signal.aborted;
            },

            get response(): FetchResponse<T> {
                return response;
            },
        };
    }

    return response;
}
