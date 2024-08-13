/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AsyncResult, IOResult } from 'happy-rusty';

/**
 * Represents the response of a fetch operation, encapsulating the result data or any error that occurred.
 *
 * @typeParam T - The type of the data expected in the response.
 */
export type FetchResponse<T, E = any> = AsyncResult<T, E>;

/**
 * Defines the structure and behavior of a fetch task, including the ability to abort the task and check its status.
 *
 * @typeParam T - The type of the data expected in the response.
 */
export interface FetchTask<T> {
    /**
     * Aborts the fetch task, optionally with a reason for the abortion.
     *
     * @param reason - An optional parameter to indicate why the task was aborted.
     */
    abort(reason?: any): void;

    /**
     * Indicates whether the fetch task has been aborted.
     */
    readonly aborted: boolean;

    /**
     * The response of the fetch task, represented as an `AsyncResult`.
     */
    readonly response: FetchResponse<T>;
}

/**
 * Specifies the expected response type of the fetch request.
 */
export type FetchResponseType = 'text' | 'arraybuffer' | 'blob' | 'json';

/**
 * Represents the progress of a fetch operation.
 */
export interface FetchProgress {
    /**
     * The total number of bytes to be received.
     */
    totalByteLength: number;

    /**
     * The number of bytes received so far.
     */
    completedByteLength: number;
}

/**
 * Extends the standard `RequestInit` interface from the Fetch API to include additional custom options.
 */
export interface FetchInit extends RequestInit {
    /**
     * Indicates whether the fetch request should be abortable.
     */
    abortable?: boolean;

    /**
     * Specifies the expected response type of the fetch request.
     */
    responseType?: FetchResponseType;

    /**
     * Specifies the maximum time in milliseconds to wait for the fetch request to complete.
     */
    timeout?: number;

    /**
     * Specifies a function to be called when the fetch request makes progress.
     * @param progressResult - The progress of the fetch request.
     */
    onProgress?: (progressResult: IOResult<FetchProgress>) => void;

    /**
     * Specifies a function to be called when the fetch request receives a chunk of data.
     * @param chunk - The chunk of data received.
     */
    onChunk?: (chunk: Uint8Array) => void;
}

/**
 * Represents an error that occurred during a fetch operation when the response is not ok.
 */
export class FetchError extends Error {
    /**
     * The name of the error.
     */
    name = 'FetchError';
    /**
     * The status code of the response.
     */
    status = 0;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}