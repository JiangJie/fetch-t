import { Err, Ok } from 'happy-rusty';
import invariant from 'tiny-invariant';
import { TIMEOUT_ERROR } from './constants.ts';
import { FetchError, type FetchInit, type FetchResponse, type FetchTask } from './defines.ts';

/**
 * Fetches a resource from the network as a text string and returns a `FetchTask` representing the operation.
 *
 * @typeParam T - The expected type of the response data.
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, including custom `FetchInit` properties.
 * @returns A `FetchTask` representing the operation with a `string` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'text';
}): FetchTask<string>;

/**
 * Fetches a resource from the network as an ArrayBuffer and returns a `FetchTask` representing the operation.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, including custom `FetchInit` properties.
 * @returns A `FetchTask` representing the operation with an `ArrayBuffer` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'arraybuffer';
}): FetchTask<ArrayBuffer>;

/**
 * Fetches a resource from the network as a Blob and returns a `FetchTask` representing the operation.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, including custom `FetchInit` properties.
 * @returns A `FetchTask` representing the operation with a `Blob` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'blob';
}): FetchTask<Blob>;

/**
 * Fetches a resource from the network and parses it as JSON, returning a `FetchTask` representing the operation.
 *
 * @typeParam T - The expected type of the parsed JSON data.
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, including custom `FetchInit` properties.
 * @returns A `FetchTask` representing the operation with a response parsed as JSON.
 */
export function fetchT<T>(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'json';
}): FetchTask<T>;

/**
 * Fetches a resource from the network as a text string and returns a `FetchResponse` representing the operation.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, specifying the response type as 'text'.
 * @returns A `FetchResponse` representing the operation with a `string` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    responseType: 'text';
}): FetchResponse<string, Error>;

/**
 * Fetches a resource from the network as an ArrayBuffer and returns a `FetchResponse` representing the operation.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, specifying the response type as 'arraybuffer'.
 * @returns A `FetchResponse` representing the operation with an `ArrayBuffer` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    responseType: 'arraybuffer';
}): FetchResponse<ArrayBuffer, Error>;

/**
 * Fetches a resource from the network as a Blob and returns a `FetchResponse` representing the operation.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, specifying the response type as 'blob'.
 * @returns A `FetchResponse` representing the operation with a `Blob` response.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    responseType: 'blob';
}): FetchResponse<Blob, Error>;

/**
 * Fetches a resource from the network and parses it as JSON, returning a `FetchResponse` representing the operation.
 *
 * @typeParam T - The expected type of the parsed JSON data.
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, specifying the response type as 'json'.
 * @returns A `FetchResponse` representing the operation with a response parsed as JSON.
 */
export function fetchT<T>(url: string | URL, init: FetchInit & {
    responseType: 'json';
}): FetchResponse<T, Error>;

/**
 * Fetches a resource from the network and returns a `FetchTask` representing the operation with a generic `Response`.
 *
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, indicating that the operation should be abortable.
 * @returns A `FetchTask` representing the operation with a generic `Response`.
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
}): FetchTask<Response>;

/**
 * Fetches a resource from the network and returns a `FetchResponse` or `FetchTask` based on the provided options.
 *
 * @typeParam T - The expected type of the response data when not using a specific `responseType`.
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, including custom `FetchInit` properties.
 * @returns A `FetchResponse` representing the operation with a `Response` object.
 */
export function fetchT(url: string | URL, init?: FetchInit): FetchResponse<Response>;

/**
 * Fetches a resource from the network and returns either a `FetchTask` or `FetchResponse` based on the provided options.
 *
 * @typeParam T - The expected type of the response data when not using a specific `responseType`.
 * @param url - The resource to fetch. Can be a URL object or a string representing a URL.
 * @param init - Additional options for the fetch operation, including custom `FetchInit` properties.
 * @returns A `FetchTask` or `FetchResponse` depending on the provided options in `init`.
 */
export function fetchT<T>(url: string | URL, init?: FetchInit): FetchTask<T> | FetchResponse<T> {
    // most cases
    if (typeof url !== 'string') {
        invariant(url instanceof URL, () => `Url must be a string or URL object but received ${ url }.`);
    }

    const {
        // default not abort able
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
                // may has no  content-length
                let totalByteLength: number | null = null;
                let completedByteLength = 0;

                if (shouldNotifyProgress) {
                    // try to get content-length
                    // compatible with http/2
                    const contentLength = res.headers.get('content-length') ?? res.headers.get('Content-Length');
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


                    // continue to read
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
            if (!controller.signal.aborted) {
                const error = new Error();
                error.name = TIMEOUT_ERROR;
                controller.abort(error);
            }
        }, timeout);

        cancelTimer = (): void => {
            if (timer) {
                clearTimeout(timer);
            }

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
    } else {
        return response;
    }
}