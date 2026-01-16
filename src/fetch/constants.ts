/**
 * Error name for aborted fetch requests.
 *
 * This matches the standard `AbortError` name used by the Fetch API when a request
 * is cancelled via `AbortController.abort()`.
 *
 * @since 1.0.0
 * @example
 * ```typescript
 * import { fetchT, ABORT_ERROR } from '@happy-ts/fetch-t';
 *
 * const task = fetchT('https://api.example.com/data', { abortable: true });
 * task.abort();
 *
 * const result = await task.result;
 * result.inspectErr((err) => {
 *     if (err.name === ABORT_ERROR) {
 *         console.log('Request was aborted');
 *     }
 * });
 * ```
 */
export const ABORT_ERROR = 'AbortError' as const;

/**
 * Error name for timed out fetch requests.
 *
 * This is set on the `Error.name` property when a request exceeds the specified
 * `timeout` duration and is automatically aborted.
 *
 * @since 1.0.0
 * @example
 * ```typescript
 * import { fetchT, TIMEOUT_ERROR } from '@happy-ts/fetch-t';
 *
 * const result = await fetchT('https://api.example.com/slow-endpoint', {
 *     timeout: 5000, // 5 seconds
 * });
 *
 * result.inspectErr((err) => {
 *     if (err.name === TIMEOUT_ERROR) {
 *         console.log('Request timed out after 5 seconds');
 *     }
 * });
 * ```
 */
export const TIMEOUT_ERROR = 'TimeoutError' as const;
