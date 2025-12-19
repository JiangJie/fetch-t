/**
 * @packageDocumentation
 * @module @happy-ts/fetch-t
 *
 * A TypeScript library that wraps the native Fetch API with enhanced capabilities:
 *
 * - **Abortable requests** - Cancel pending requests with `FetchTask.abort()`
 * - **Type-safe responses** - Automatic parsing with `responseType` parameter
 * - **Timeout support** - Auto-abort long-running requests
 * - **Progress tracking** - Monitor download progress with callbacks
 * - **Result type error handling** - Uses `Result<T, E>` instead of throwing exceptions
 *
 * @example
 * ```typescript
 * import { fetchT, FetchError, ABORT_ERROR, TIMEOUT_ERROR } from '@happy-ts/fetch-t';
 *
 * // Basic usage
 * const result = await fetchT('https://api.example.com/data', {
 *     responseType: 'json',
 * });
 *
 * result
 *     .inspect((data) => console.log(data))
 *     .inspectErr((err) => {
 *         if (err instanceof FetchError) {
 *             console.error('HTTP Error:', err.status);
 *         } else if (err.name === TIMEOUT_ERROR) {
 *             console.error('Request timed out');
 *         } else if (err.name === ABORT_ERROR) {
 *             console.error('Request was aborted');
 *         }
 *     });
 * ```
 */
export * from './fetch/constants.ts';
export * from './fetch/defines.ts';
export * from './fetch/fetch.ts';
