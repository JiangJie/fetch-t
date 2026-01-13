import { Err, Ok, type AsyncIOResult } from 'happy-rusty';
import { ABORT_ERROR } from './constants.ts';
import { FetchError, type FetchInit, type FetchResponse, type FetchResponseData, type FetchResponseType, type FetchRetryOptions, type FetchTask } from './defines.ts';

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
}): FetchTask<T | null>;

/**
 * Fetches a resource from the network as a ReadableStream and returns an abortable `FetchTask`.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `abortable: true` and `responseType: 'stream'`.
 * @returns A `FetchTask` representing the abortable operation with a `ReadableStream<Uint8Array<ArrayBuffer>>` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'stream';
}): FetchTask<ReadableStream<Uint8Array<ArrayBuffer>> | null>;

/**
 * Fetches a resource from the network as a Uint8Array<ArrayBuffer> and returns an abortable `FetchTask`.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `abortable: true` and `responseType: 'bytes'`.
 * @returns A `FetchTask` representing the abortable operation with a `Uint8Array<ArrayBuffer>` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'bytes';
}): FetchTask<Uint8Array<ArrayBuffer>>;

/**
 * Fetches a resource from the network and returns an abortable `FetchTask` with a dynamic response type.
 *
 * Use this overload when `responseType` is a `FetchResponseType` union type.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `abortable: true` and a `FetchResponseType`.
 * @returns A `FetchTask` representing the abortable operation with a `FetchResponseData` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: FetchResponseType;
}): FetchTask<FetchResponseData>;

/**
 * Fetches a resource from the network as a text string.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `responseType: 'text'` and `abortable` must be `false` or omitted.
 * @returns A `FetchResponse` representing the operation with a `string` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable?: false;
    responseType: 'text';
}): FetchResponse<string, Error>;

/**
 * Fetches a resource from the network as an ArrayBuffer.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `responseType: 'arraybuffer'` and `abortable` must be `false` or omitted.
 * @returns A `FetchResponse` representing the operation with an `ArrayBuffer` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable?: false;
    responseType: 'arraybuffer';
}): FetchResponse<ArrayBuffer, Error>;

/**
 * Fetches a resource from the network as a Blob.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `responseType: 'blob'` and `abortable` must be `false` or omitted.
 * @returns A `FetchResponse` representing the operation with a `Blob` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable?: false;
    responseType: 'blob';
}): FetchResponse<Blob, Error>;

/**
 * Fetches a resource from the network and parses it as JSON.
 *
 * @typeParam T - The expected type of the parsed JSON data.
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `responseType: 'json'` and `abortable` must be `false` or omitted.
 * @returns A `FetchResponse` representing the operation with a response parsed as type `T`.
 */
export function fetchT<T>(url: string | URL, init: FetchInit & {
    abortable?: false;
    responseType: 'json';
}): FetchResponse<T | null, Error>;

/**
 * Fetches a resource from the network as a ReadableStream.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `responseType: 'stream'` and `abortable` must be `false` or omitted.
 * @returns A `FetchResponse` representing the operation with a `ReadableStream<Uint8Array<ArrayBuffer>>` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable?: false;
    responseType: 'stream';
}): FetchResponse<ReadableStream<Uint8Array<ArrayBuffer>> | null, Error>;

/**
 * Fetches a resource from the network as a Uint8Array<ArrayBuffer>.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, must include `responseType: 'bytes'` and `abortable` must be `false` or omitted.
 * @returns A `FetchResponse` representing the operation with a `Uint8Array<ArrayBuffer>` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable?: false;
    responseType: 'bytes';
}): FetchResponse<Uint8Array<ArrayBuffer>, Error>;

/**
 * Fetches a resource from the network with a dynamic response type (non-abortable).
 *
 * Use this overload when `responseType` is a `FetchResponseType` union type.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation with a `FetchResponseType`, and `abortable` must be `false` or omitted.
 * @returns A `FetchResponse` representing the operation with a `FetchResponseData` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable?: false;
    responseType: FetchResponseType;
}): FetchResponse<FetchResponseData, Error>;

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
 * @param init - Optional additional options for the fetch operation, and `abortable` must be `false` or omitted.
 * @returns A `FetchResponse` representing the operation with a `Response` object.
 */
export function fetchT(url: string | URL, init?: FetchInit & {
    abortable?: false;
}): FetchResponse<Response>;

/**
 * Enhanced fetch function that wraps the native Fetch API with additional capabilities.
 *
 * Features:
 * - **Abortable requests**: Set `abortable: true` to get a `FetchTask` with `abort()` method.
 * - **Type-safe responses**: Use `responseType` to automatically parse responses as text, JSON, ArrayBuffer, Blob, bytes, or stream.
 * - **Timeout support**: Set `timeout` in milliseconds to auto-abort long-running requests.
 * - **Progress tracking**: Use `onProgress` callback to track download progress (requires Content-Length header).
 * - **Chunk streaming**: Use `onChunk` callback to receive raw data chunks as they arrive.
 * - **Retry support**: Use `retry` to automatically retry failed requests with configurable delay and conditions.
 * - **Result type error handling**: Returns `Result<T, Error>` instead of throwing exceptions for runtime errors.
 *
 * **Note**: Invalid parameters throw synchronously (fail-fast) rather than returning rejected Promises.
 * This differs from native `fetch` behavior and helps catch programming errors during development.
 *
 * @typeParam T - The expected type of the response data.
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, extending standard `RequestInit` with custom properties.
 * @returns A `FetchTask<T>` if `abortable: true`, otherwise a `FetchResponse<T>` (which is `AsyncResult<T, Error>`).
 * @throws {TypeError} If `url` is invalid or a relative URL in non-browser environment.
 * @throws {TypeError} If `responseType` is not a valid response type.
 * @throws {TypeError} If `timeout` is not a number.
 * @throws {Error} If `timeout` is not greater than 0.
 * @throws {TypeError} If `onProgress` or `onChunk` is provided but not a function.
 * @throws {TypeError} If `retry.retries` is not an integer.
 * @throws {Error} If `retry.retries` is negative.
 * @throws {TypeError} If `retry.delay` is not a number or function.
 * @throws {Error} If `retry.delay` is a negative number.
 * @throws {TypeError} If `retry.when` is not an array or function.
 * @throws {TypeError} If `retry.onRetry` is provided but not a function.
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
export function fetchT(url: string | URL, init?: FetchInit): FetchTask<FetchResponseData> | FetchResponse<FetchResponseData> {
    // Validate and parse URL
    const parsedUrl = validateUrl(url);

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

    // Preserve user's original signal before modifications (rest.signal will be reassigned in setSignal)
    const userSignal = rest.signal;

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
     * Configures the abort signal for a fetch attempt.
     *
     * Combines multiple signals:
     * - User's external signal (from init.signal)
     * - Internal abort controller signal (for abortable requests)
     * - Timeout signal (creates a new one each call for per-attempt timeout)
     *
     * Must be called before each fetch attempt to ensure fresh timeout signal on retries.
     */
    const configureSignal = (): void => {
        const signals: AbortSignal[] = [];

        // Merge user's signal from init (if provided)
        if (userSignal) {
            signals.push(userSignal);
        }

        if (userController) {
            signals.push(userController.signal);
        }

        if (typeof timeout === 'number') {
            signals.push(AbortSignal.timeout(timeout));
        }

        // Combine all signals
        if (signals.length > 0) {
            rest.signal = signals.length === 1
                ? signals[0]
                : AbortSignal.any(signals);
        }
    };

    /**
     * Performs a single fetch attempt with optional timeout.
     */
    const doFetch = async (): AsyncIOResult<FetchResponseData> => {
        configureSignal();

        try {
            const response = await fetch(parsedUrl, rest);

            if (!response.ok) {
                // Cancel the response body to free resources
                response.body?.cancel().catch(() => {
                    // Silently ignore stream cancel errors
                });
                return Err(new FetchError(response.statusText, response.status));
            }

            return await processResponse(response);
        } catch (err) {
            return Err(err instanceof Error
                ? err
                // Non-Error type, most likely an abort reason
                : wrapAbortReason(err),
            );
        }
    };

    /**
     * Sets up progress tracking and chunk callbacks using a cloned response.
     * The original response is returned unchanged for further processing.
     */
    const setupProgressCallbacks = async (response: Response): Promise<void> => {
        let totalByteLength: number | undefined;
        let completedByteLength = 0;

        if (onProgress) {
            const contentLength = response.headers.get('content-length');
            if (contentLength == null) {
                try {
                    onProgress(Err(new Error('No content-length in response headers')));
                } catch {
                    // Silently ignore user callback errors
                }
            } else {
                totalByteLength = Number.parseInt(contentLength, 10);
            }
        }

        const body = response.clone().body as ReadableStream<Uint8Array<ArrayBuffer>>;

        try {
            for await (const chunk of body) {
                if (onChunk) {
                    try {
                        onChunk(chunk);
                    } catch {
                        // Silently ignore user callback errors
                    }
                }

                if (onProgress && totalByteLength != null) {
                    completedByteLength += chunk.byteLength;
                    try {
                        onProgress(Ok({
                            totalByteLength,
                            completedByteLength,
                        }));
                    } catch {
                        // Silently ignore user callback errors
                    }
                }
            }
        } catch {
            // Silently ignore stream read errors
        }
    };

    /**
     * Processes the response based on responseType and callbacks.
     */
    const processResponse = async (response: Response): AsyncIOResult<FetchResponseData> => {
        // Setup progress/chunk callbacks if needed (uses cloned response internally)
        if (response.body && (onProgress || onChunk)) {
            setupProgressCallbacks(response);
        }

        switch (responseType) {
            case 'json': {
                // Align with stream behavior: no body yields Ok(null)
                if (response.body == null) {
                    return Ok(null);
                }
                try {
                    return Ok(await response.json());
                } catch {
                    return Err(new Error('Response is invalid json while responseType is json'));
                }
            }
            case 'text': {
                return Ok(await response.text());
            }
            case 'bytes': {
                // Use native bytes() if available, otherwise fallback to arrayBuffer()
                if (typeof response.bytes === 'function') {
                    return Ok(await response.bytes());
                }
                // Fallback for older environments
                return Ok(new Uint8Array(await response.arrayBuffer()));
            }
            case 'arraybuffer': {
                return Ok(await response.arrayBuffer());
            }
            case 'blob': {
                return Ok(await response.blob());
            }
            case 'stream': {
                return Ok(response.body);
            }
            default: {
                // default return the original Response object to preserve all metadata
                return Ok(response);
            }
        }
    };

    /**
     * Performs fetch with retry logic.
     */
    const fetchWithRetry = async (): FetchResponse<FetchResponseData, Error> => {
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
        // lastError is guaranteed to be defined here because:
        // 1. do...while loop executes at least once
        // 2. We only reach here if result.isErr()
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

            get response(): FetchResponse<FetchResponseData> {
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
        const validTypes = ['text', 'arraybuffer', 'blob', 'json', 'bytes', 'stream'];
        if (!validTypes.includes(responseType)) {
            throw new TypeError(`responseType must be one of ${ validTypes.join(', ') } but received ${ responseType }`);
        }
    }

    if (timeout != null) {
        if (typeof timeout !== 'number') {
            throw new TypeError(`timeout must be a number but received ${ typeof timeout }`);
        }
        if (timeout <= 0) {
            throw new Error(`timeout must be a number greater than 0 but received ${ timeout }`);
        }
    }

    if (onProgress != null) {
        if (typeof onProgress !== 'function') {
            throw new TypeError(`onProgress callback must be a function but received ${ typeof onProgress }`);
        }
    }

    if (onChunk != null) {
        if (typeof onChunk !== 'function') {
            throw new TypeError(`onChunk callback must be a function but received ${ typeof onChunk }`);
        }
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

    if (!Number.isInteger(retries)) {
        throw new TypeError(`Retry count must be an integer but received ${ retries }`);
    }
    if (retries < 0) {
        throw new Error(`Retry count must be non-negative but received ${ retries }`);
    }

    if (typeof delay === 'number') {
        if (delay < 0) {
            throw new Error(`Retry delay must be a non-negative number but received ${ delay }`);
        }
    } else {
        if (typeof delay !== 'function') {
            throw new TypeError(`Retry delay must be a number or a function but received ${ typeof delay }`);
        }
    }

    if (when != null) {
        if (!Array.isArray(when) && typeof when !== 'function') {
            throw new TypeError(`Retry when condition must be an array of status codes or a function but received ${ typeof when }`);
        }
    }

    if (onRetry != null) {
        if (typeof onRetry !== 'function') {
            throw new TypeError(`Retry onRetry callback must be a function but received ${ typeof onRetry }`);
        }
    }

    return { retries, delay, when, onRetry };
}

/**
 * Validates and parses a URL string or URL object.
 * In browser environments, relative URLs are resolved against `location.href`.
 * In non-browser environments (Node/Deno/Bun), only absolute URLs are valid.
 *
 * @param url - The URL to validate, either a string or URL object.
 * @returns The parsed URL object.
 * @throws {TypeError} If the URL is invalid or cannot be parsed.
 */
function validateUrl(url: string | URL): URL {
    if (url instanceof URL) {
        return url;
    }

    try {
        // In browser, use location.href as base for relative URLs
        // In Node/Deno/Bun, location is undefined, so relative URLs will fail
        const base = typeof location !== 'undefined' ? location.href : undefined;
        return new URL(url, base);
    } catch {
        throw new TypeError(`Invalid URL: ${ url }`);
    }
}
