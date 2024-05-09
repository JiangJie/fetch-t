/* eslint-disable @typescript-eslint/no-explicit-any */
import { Err, Ok } from '@happy-js/happy-rusty';
import { assertUrl } from './assertions.ts';
import type { FetchInit, FetchResponse, FetchTask } from './defines.ts';

/**
 * Return `FetchTask<string>`.
 * @param url
 * @param init
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'text';
}): FetchTask<string>;
/**
 * Return `FetchTask<ArrayBuffer>`.
 * @param url
 * @param init
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'arraybuffer';
}): FetchTask<ArrayBuffer>;
/**
 * Return `FetchTask<Blob>`.
 * @param url
 * @param init
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'blob';
}): FetchTask<Blob>;
/**
 * Return `FetchTask<T>`.
 */
export function fetchT<T>(url: string | URL, init: FetchInit & {
    abortable: true;
    responseType: 'json';
}): FetchTask<T>;
/**
 * Return `FetchResponse<string>`.
 * @param url
 * @param init
 */
export function fetchT(url: string | URL, init: FetchInit & {
    responseType: 'text';
}): FetchResponse<string>;
/**
 * Return `FetchResponse<ArrayBuffer>`.
 * @param url
 * @param init
 */
export function fetchT(url: string | URL, init: FetchInit & {
    responseType: 'arraybuffer';
}): FetchResponse<ArrayBuffer>;
/**
 * Return `FetchResponse<Blob>`.
 * @param url
 * @param init
 */
export function fetchT(url: string | URL, init: FetchInit & {
    responseType: 'blob';
}): FetchResponse<Blob>;
/**
 * Return `FetchResponse<T>`.
 * @param url
 * @param init
 */
export function fetchT<T>(url: string | URL, init: FetchInit & {
    responseType: 'json';
}): FetchResponse<T>;
/**
 * Return `FetchTask<Response>`.
 * @param url
 * @param init
 */
export function fetchT(url: string | URL, init: FetchInit & {
    abortable: true;
}): FetchTask<Response>;
/**
 * Return `FetchTask<T>` or `FetchResponse<T>`.
 * @param url
 * @param init
 */
export function fetchT<T = any>(url: string | URL, init: FetchInit): FetchTask<T> | FetchResponse<T>;
/**
 * Return `FetchResponse<Response>`.
 * @param url
 * @param init
 */
export function fetchT(url: string | URL, init?: RequestInit): FetchResponse<Response>;
/**
 * Request the url and return the corresponding type based on the responseType.
 * @param url url to fetch
 * @param init fetch init
 * @returns {FetchTask<T> | FetchResponse<T>} an abort able fetch task or just response
 */
export function fetchT<T = any>(url: string | URL, init?: FetchInit): FetchTask<T> | FetchResponse<T> {
    if (typeof url === 'string') {
        assertUrl(url);
    }

    // default not abort able
    const { abortable = false, responseType, ...rest } = init ?? {};

    let controller: AbortController;

    if (abortable) {
        controller = new AbortController();
        rest.signal = controller.signal;
    }

    const response: FetchResponse<T> = fetch(url, rest).then(async (res): FetchResponse<T> => {
        if (!res.ok) {
            return Err(new Error(`fetch status: ${ res.status }`));
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
        return Err(err);
    });

    if (abortable) {
        return {
            abort(reason?: any): void {
                controller.abort(reason);
            },
            get aborted(): boolean {
                return controller.signal.aborted;
            },
            response,
        };
    } else {
        return response;
    }
}