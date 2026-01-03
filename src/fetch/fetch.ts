import { Err, Ok, type AsyncResult } from 'happy-rusty';
import invariant from 'tiny-invariant';
import { ABORT_ERROR } from './constants.ts';
import { FetchError, type FetchInit, type FetchResponse, type FetchRetryOptions, type FetchTask } from './defines.ts';

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

    const fetchInit = init ?? {};

    const {
        retries,
        delay: retryDelay,
        when: retryWhen,
        onRetry,
    } = validateOptions(fetchInit);

    const {
        // default not abortable
        abortable = false,
        responseType,
        timeout,
        onProgress,
        onChunk,
        ...rest
    } = fetchInit;

    // User controller for manual abort (stops all retries)
    let userController: AbortController | undefined;
    if (abortable) {
        userController = new AbortController();
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
     * Performs a single fetch attempt with optional timeout.
     */
    const doFetch = async (): AsyncResult<T, Error> => {
        const signals: AbortSignal[] = [];

        if (userController) {
            signals.push(userController.signal);
        }

        if (typeof timeout === 'number') {
            signals.push(AbortSignal.timeout(timeout));
        }

        if (signals.length > 0) {
            rest.signal = signals.length === 1
                ? signals[0]
                : AbortSignal.any(signals);
        }

        try {
            const res = await fetch(url, rest);

            if (!res.ok) {
                await res.body?.cancel();
                return Err(new FetchError(res.statusText, res.status));
            }

            return await processResponse(res);
        } catch (err) {
            return Err(err instanceof Error
                ? err
                // Non-Error type, most likely an abort reason
                : wrapAbortReason(err),
            );
        }
    };

    /**
     * Processes the response based on responseType and callbacks.
     */
    const processResponse = async (res: Response): AsyncResult<T, Error> => {
        let response = res;

        // should notify progress or data chunk?
        if (res.body && (onProgress || onChunk)) {
            // tee the original stream to two streams, one for notify progress, another for response
            const [stream1, stream2] = res.body.tee();

            const reader = stream1.getReader();
            // Content-Length may not be present in response headers
            let totalByteLength: number | null = null;
            let completedByteLength = 0;

            if (onProgress) {
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
                if (onChunk) {
                    try {
                        onChunk(value);
                    } catch {
                        // Silently ignore user callback errors
                    }
                }

                // notify progress
                if (onProgress && totalByteLength != null) {
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
    };

    /**
     * Performs fetch with retry logic.
     */
    const fetchWithRetry = async (): FetchResponse<T, Error> => {
        let lastError: Error | undefined;
        let attempt = 0;

        do {
            // Before retry (not first attempt), wait for delay
            if (attempt > 0) {
                // Check if user aborted before delay (e.g., aborted in `when` callback)
                if (userController?.signal.aborted) {
                    return Err(userController.signal.reason as Error);
                }

                const delayMs = getRetryDelay(attempt);
                // Wait for delay if necessary
                if (delayMs > 0) {
                    await delay(delayMs);

                    // Check if user aborted during delay
                    if (userController?.signal.aborted) {
                        return Err(userController.signal.reason as Error);
                    }
                }

                // Call onRetry right before the actual retry request
                try {
                    onRetry?.(lastError as Error, attempt);
                } catch {
                    // Silently ignore user callback errors
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

    if (abortable && userController) {
        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            abort(reason?: any): void {
                if (reason instanceof Error) {
                    userController.abort(reason);
                } else if (reason != null) {
                    userController.abort(wrapAbortReason(reason));
                } else {
                    userController.abort();
                }
            },

            get aborted(): boolean {
                return userController.signal.aborted;
            },

            get response(): FetchResponse<T> {
                return response;
            },
        };
    }

    return response;
}

/**
 * Delays execution for the specified number of milliseconds.
 */
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wraps a non-Error abort reason into an Error with ABORT_ERROR name.
 */
function wrapAbortReason(reason: unknown): Error {
    const error = new Error(typeof reason === 'string' ? reason : String(reason));
    error.name = ABORT_ERROR;
    error.cause = reason;
    return error;
}

interface ParsedRetryOptions extends FetchRetryOptions {
    retries: number;
    delay: number | ((attempt: number) => number);
}

/**
 * Validates fetch options and parses retry configuration.
 */
function validateOptions(init: FetchInit): ParsedRetryOptions {
    const {
        responseType,
        timeout,
        retry: retryOptions = 0,
        onProgress,
        onChunk,
    } = init;

    if (responseType != null) {
        const validTypes = ['text', 'arraybuffer', 'blob', 'json', 'stream'];
        invariant(validTypes.includes(responseType), () => `responseType must be one of ${ validTypes.join(', ') } but received ${ responseType }`);
    }

    if (timeout != null) {
        invariant(typeof timeout === 'number' && timeout > 0, () => `timeout must be a number greater than 0 but received ${ timeout }`);
    }

    if (onProgress != null) {
        invariant(typeof onProgress === 'function', () => `onProgress callback must be a function but received ${ typeof onProgress }`);
    }

    if (onChunk != null) {
        invariant(typeof onChunk === 'function', () => `onChunk callback must be a function but received ${ typeof onChunk }`);
    }

    // Parse retry options
    let retries = 0;
    let delay: number | ((attempt: number) => number) = 0;
    let when: ((error: Error, attempt: number) => boolean) | number[] | undefined;
    let onRetry: ((error: Error, attempt: number) => void) | undefined;

    if (typeof retryOptions === 'number') {
        retries = retryOptions;
    } else if (retryOptions && typeof retryOptions === 'object') {
        retries = retryOptions.retries ?? 0;
        delay = retryOptions.delay ?? 0;
        when = retryOptions.when;
        onRetry = retryOptions.onRetry;
    }

    invariant(Number.isInteger(retries) && retries >= 0, () => `Retry count must be a non-negative integer but received ${ retries }`);

    if (typeof delay === 'number') {
        invariant(delay >= 0, () => `Retry delay must be a non-negative number but received ${ delay }`);
    } else {
        invariant(typeof delay === 'function', () => `Retry delay must be a number or a function but received ${ typeof delay }`);
    }

    if (when != null) {
        invariant(Array.isArray(when) || typeof when === 'function', () => `Retry when condition must be an array of status codes or a function but received ${ typeof when }`);
    }

    if (onRetry != null) {
        invariant(typeof onRetry === 'function', () => `Retry onRetry callback must be a function but received ${ typeof onRetry }`);
    }

    return { retries, delay, when, onRetry };
}
