/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AsyncResult } from '@happy-js/happy-rusty';

/**
 * Response generic type.
 */
export type FetchResponse<T> = AsyncResult<T, any>;

/**
 * Return type of fetchT when abortable.
 */
export interface FetchTask<T> {
    /**
     * Aborts the request.
     * @param reason The reason for aborting the request.
     */
    abort(reason?: any): void;
    /**
     * Returns true if inner AbortSignal's AbortController has signaled to abort, and false otherwise.
     */
    aborted: boolean;
    /**
     * The response of the request.
     */
    response: FetchResponse<T>;
}

/**
 * Parameters for fetchT.
 */
export interface FetchInit extends RequestInit {
    /**
     * true well return abort method.
     */
    abortable?: boolean;
    /**
     * The response type of the request.
     */
    responseType?: 'text' | 'arraybuffer' | 'blob' | 'json';
}