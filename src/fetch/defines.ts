/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AsyncResult, IOResult } from 'happy-rusty';

/**
 * Represents the response of a fetch operation as an async Result type.
 *
 * This is an alias for `AsyncResult<T, E>` from the `happy-rusty` library,
 * providing Rust-like error handling without throwing exceptions.
 *
 * @typeParam T - The type of the data expected in a successful response.
 * @typeParam E - The type of the error (defaults to `any`). Typically `Error` or `FetchError`.
 *
 * @example
 * ```typescript
 * import { fetchT, type FetchResponse } from '@happy-ts/fetch-t';
 *
 * // FetchResponse is a Promise that resolves to Result<T, E>
 * const response: FetchResponse<string> = fetchT('https://api.example.com', {
 *     responseType: 'text',
 * });
 *
 * const result = await response;
 * result
 *     .inspect((text) => console.log('Success:', text))
 *     .inspectErr((err) => console.error('Error:', err));
 * ```
 */
export type FetchResponse<T, E = any> = AsyncResult<T, E>;

/**
 * Represents an abortable fetch operation with control methods.
 *
 * Returned when `abortable: true` is set in the fetch options. Provides
 * the ability to cancel the request and check its abort status.
 *
 * @typeParam T - The type of the data expected in the response.
 *
 * @example
 * ```typescript
 * import { fetchT, type FetchTask } from '@happy-ts/fetch-t';
 *
 * interface User {
 *     id: number;
 *     name: string;
 * }
 *
 * const task: FetchTask<User> = fetchT<User>('https://api.example.com/user/1', {
 *     abortable: true,
 *     responseType: 'json',
 * });
 *
 * // Check if aborted
 * console.log('Is aborted:', task.aborted); // false
 *
 * // Abort with optional reason
 * task.abort('User navigated away');
 *
 * // Access the response (will be an error after abort)
 * const result = await task.response;
 * result.inspectErr((err) => console.log('Aborted:', err.message));
 * ```
 */
export interface FetchTask<T> {
    /**
     * Aborts the fetch task, optionally with a reason.
     *
     * Once aborted, the `response` promise will resolve to an `Err` containing
     * an `AbortError`. The abort reason can be any value and will be passed
     * to the underlying `AbortController.abort()`.
     *
     * @param reason - An optional value indicating why the task was aborted.
     *                 This can be an Error, string, or any other value.
     */
    abort(reason?: any): void;

    /**
     * Indicates whether the fetch task has been aborted.
     *
     * Returns `true` if `abort()` was called or if the request timed out.
     */
    readonly aborted: boolean;

    /**
     * The response promise of the fetch task.
     *
     * Resolves to `Ok<T>` on success, or `Err<Error>` on failure (including abort).
     */
    readonly response: FetchResponse<T>;
}

/**
 * Specifies the expected response type for automatic parsing.
 *
 * - `'text'` - Parse response as string via `Response.text()`
 * - `'json'` - Parse response as JSON via `Response.json()`
 * - `'arraybuffer'` - Parse response as ArrayBuffer via `Response.arrayBuffer()`
 * - `'bytes'` - Parse response as Uint8Array<ArrayBuffer> via `Response.bytes()` (with fallback for older environments)
 * - `'blob'` - Parse response as Blob via `Response.blob()`
 * - `'stream'` - Return the raw `ReadableStream` for streaming processing
 *
 * If not specified, the raw `Response` object is returned.
 *
 * @example
 * ```typescript
 * import { fetchT, type FetchResponseType } from '@happy-ts/fetch-t';
 *
 * const responseType: FetchResponseType = 'json';
 *
 * const result = await fetchT('https://api.example.com/data', { responseType });
 * ```
 */
export type FetchResponseType = 'text' | 'arraybuffer' | 'blob' | 'json' | 'bytes' | 'stream';

/**
 * Represents the download progress of a fetch operation.
 *
 * Passed to the `onProgress` callback when tracking download progress.
 * Note: Progress tracking requires the server to send a `Content-Length` header.
 *
 * @example
 * ```typescript
 * import { fetchT, type FetchProgress } from '@happy-ts/fetch-t';
 *
 * await fetchT('https://example.com/file.zip', {
 *     responseType: 'blob',
 *     onProgress: (result) => {
 *         result.inspect((progress: FetchProgress) => {
 *             const percent = (progress.completedByteLength / progress.totalByteLength) * 100;
 *             console.log(`Downloaded: ${percent.toFixed(1)}%`);
 *         });
 *     },
 * });
 * ```
 */
export interface FetchProgress {
    /**
     * The total number of bytes to be received (from Content-Length header).
     */
    totalByteLength: number;

    /**
     * The number of bytes received so far.
     */
    completedByteLength: number;
}

/**
 * Options for configuring retry behavior.
 */
export interface FetchRetryOptions {
    /**
     * Number of times to retry the request on failure.
     *
     * By default, only network errors trigger retries. HTTP errors (4xx, 5xx)
     * require explicit configuration via `when`.
     *
     * @default 0 (no retries)
     */
    retries?: number;

    /**
     * Delay between retry attempts in milliseconds.
     *
     * Can be a static number or a function for custom strategies like exponential backoff.
     * The function receives the current attempt number (1-indexed).
     *
     * @default 0 (immediate retry)
     */
    delay?: number | ((attempt: number) => number);

    /**
     * Conditions under which to retry the request.
     *
     * Can be an array of HTTP status codes or a custom function.
     * By default, only network errors (not FetchError) trigger retries.
     */
    when?: number[] | ((error: Error, attempt: number) => boolean);

    /**
     * Callback invoked before each retry attempt.
     *
     * Useful for logging, metrics, or adjusting request parameters.
     */
    onRetry?: (error: Error, attempt: number) => void;
}

/**
 * Extended fetch options that add additional capabilities to the standard `RequestInit`.
 *
 * @example
 * ```typescript
 * import { fetchT, type FetchInit } from '@happy-ts/fetch-t';
 *
 * const options: FetchInit = {
 *     // Standard RequestInit options
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ key: 'value' }),
 *
 *     // Extended options
 *     abortable: true,           // Return FetchTask for manual abort control
 *     responseType: 'json',      // Auto-parse response as JSON
 *     timeout: 10000,            // Abort after 10 seconds
 *     onProgress: (result) => {  // Track download progress
 *         result.inspect(({ completedByteLength, totalByteLength }) => {
 *             console.log(`${completedByteLength}/${totalByteLength}`);
 *         });
 *     },
 *     onChunk: (chunk) => {      // Receive raw data chunks
 *         console.log('Received chunk:', chunk.byteLength, 'bytes');
 *     },
 * };
 *
 * const task = fetchT('https://api.example.com/upload', options);
 * ```
 */
export interface FetchInit extends RequestInit {
    /**
     * When `true`, returns a `FetchTask` instead of `FetchResponse`.
     *
     * The `FetchTask` provides `abort()` method and `aborted` status.
     *
     * @default false
     */
    abortable?: boolean;

    /**
     * Specifies how the response body should be parsed.
     *
     * - `'text'` - Returns `string`
     * - `'json'` - Returns parsed JSON (type `T`)
     * - `'arraybuffer'` - Returns `ArrayBuffer`
     * - `'bytes'` - Returns `Uint8Array<ArrayBuffer>` (with fallback for older environments)
     * - `'blob'` - Returns `Blob`
     * - `'stream'` - Returns `ReadableStream<Uint8Array<ArrayBuffer>>`
     * - `undefined` - Returns raw `Response` object
     */
    responseType?: FetchResponseType;

    /**
     * Maximum time in milliseconds to wait for the request to complete.
     *
     * If exceeded, the request is automatically aborted with a `TimeoutError`.
     * Must be a positive number.
     */
    timeout?: number;

    /**
     * Retry options.
     *
     * Can be a number (shorthand for retries count) or an options object.
     *
     * @example
     * ```typescript
     * // Retry up to 3 times on network errors
     * const result = await fetchT('https://api.example.com/data', {
     *     retry: 3,
     * });
     *
     * // Detailed configuration
     * const result = await fetchT('https://api.example.com/data', {
     *     retry: {
     *         retries: 3,
     *         delay: 1000,
     *         when: [500, 502],
     *         onRetry: (error, attempt) => console.log(error),
     *     },
     * });
     * ```
     */
    retry?: number | FetchRetryOptions;

    /**
     * Callback invoked during download to report progress.
     *
     * Receives an `IOResult<FetchProgress>`:
     * - `Ok(FetchProgress)` - Progress update with byte counts
     * - `Err(Error)` - If `Content-Length` header is missing (called once)
     *
     * @param progressResult - The progress result, either success with progress data or error.
     */
    onProgress?: (progressResult: IOResult<FetchProgress>) => void;

    /**
     * Callback invoked when a chunk of data is received.
     *
     * Useful for streaming or processing data as it arrives.
     * Each chunk is a `Uint8Array<ArrayBuffer>` containing the raw bytes.
     *
     * @param chunk - The raw data chunk received from the response stream.
     */
    onChunk?: (chunk: Uint8Array<ArrayBuffer>) => void;
}

/**
 * Custom error class for HTTP error responses (non-2xx status codes).
 *
 * Thrown when `Response.ok` is `false`. Contains the HTTP status code
 * for programmatic error handling.
 *
 * @example
 * ```typescript
 * import { fetchT, FetchError } from '@happy-ts/fetch-t';
 *
 * const result = await fetchT('https://api.example.com/not-found', {
 *     responseType: 'json',
 * });
 *
 * result.inspectErr((err) => {
 *     if (err instanceof FetchError) {
 *         console.log('HTTP Status:', err.status);  // e.g., 404
 *         console.log('Status Text:', err.message); // e.g., "Not Found"
 *
 *         // Handle specific status codes
 *         switch (err.status) {
 *             case 401:
 *                 console.log('Unauthorized - please login');
 *                 break;
 *             case 404:
 *                 console.log('Resource not found');
 *                 break;
 *             case 500:
 *                 console.log('Server error');
 *                 break;
 *         }
 *     }
 * });
 * ```
 */
export class FetchError extends Error {
    /**
     * The error name, always `'FetchError'`.
     */
    override name = 'FetchError';

    /**
     * The HTTP status code of the response (e.g., 404, 500).
     */
    status = 0;

    /**
     * Creates a new FetchError instance.
     *
     * @param message - The status text from the HTTP response (e.g., "Not Found").
     * @param status - The HTTP status code (e.g., 404).
     */
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}
