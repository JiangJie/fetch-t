import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { ABORT_ERROR, FetchError, fetchT, TIMEOUT_ERROR, type FetchTask } from '../src/mod.ts';

// Mock server setup
const server = setupServer(
    // GET /api/data - returns JSON
    http.get('http://mock.test/api/data', () => {
        return HttpResponse.json({ id: 1, title: 'Test Data' });
    }),

    // GET /api/text - returns text
    http.get('http://mock.test/api/text', () => {
        return new HttpResponse('Hello World', {
            headers: { 'Content-Type': 'text/plain' },
        });
    }),

    // GET /api/binary - returns binary data
    http.get('http://mock.test/api/binary', () => {
        const buffer = new Uint8Array([1, 2, 3, 4, 5]).buffer;
        return new HttpResponse(buffer, {
            headers: { 'Content-Type': 'application/octet-stream' },
        });
    }),

    // GET /api/with-content-length - returns data with Content-Length header
    http.get('http://mock.test/api/with-content-length', () => {
        const data = JSON.stringify({ id: 1 });
        return new HttpResponse(data, {
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': String(data.length),
            },
        });
    }),

    // GET /api/no-content-length - returns data without Content-Length header
    http.get('http://mock.test/api/no-content-length', () => {
        const data = JSON.stringify({ id: 1 });
        return new HttpResponse(data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }),

    // POST /api/data - returns posted data
    http.post('http://mock.test/api/data', async ({ request }) => {
        const body = await request.json() as Record<string, unknown>;
        return HttpResponse.json({ received: body });
    }),

    // HEAD /api/data - returns headers only
    http.head('http://mock.test/api/data', () => {
        return new HttpResponse(null, {
            headers: { 'X-Custom-Header': 'test' },
        });
    }),

    // GET /api/404 - returns 404 error (no body)
    http.get('http://mock.test/api/404', () => {
        return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
    }),

    // GET /api/500 - returns 500 error (no body)
    http.get('http://mock.test/api/500', () => {
        return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
    }),

    // DELETE /api/data - returns 204 No Content
    http.delete('http://mock.test/api/data', () => {
        return new HttpResponse(null, { status: 204 });
    }),

    // GET /api/invalid-json - returns invalid JSON
    http.get('http://mock.test/api/invalid-json', () => {
        return new HttpResponse('<html>Not JSON</html>', {
            headers: { 'Content-Type': 'text/html' },
        });
    }),

    // GET /api/slow - slow response for timeout testing
    http.get('http://mock.test/api/slow', async () => {
        await new Promise(resolve => setTimeout(resolve, 5000));
        return HttpResponse.json({ id: 1 });
    }),

    // GET /api/stream-error - stream that errors mid-way
    http.get('http://mock.test/api/stream-error', () => {
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                controller.enqueue(encoder.encode('chunk-0'));
                await new Promise(r => setTimeout(r, 10));
                controller.error(new Error('Stream read error'));
            },
        });
        return new HttpResponse(stream, {
            headers: {
                'Content-Type': 'text/plain',
                'Content-Length': '50',
            },
        });
    }),

    // GET /api/stream-error-immediate - stream that errors immediately on first read
    http.get('http://mock.test/api/stream-error-immediate', () => {
        const stream = new ReadableStream({
            start(controller) {
                controller.error(new Error('Immediate stream error'));
            },
        });
        return new HttpResponse(stream, {
            headers: {
                'Content-Type': 'text/plain',
                'Content-Length': '50',
            },
        });
    }),

    // GET /api/stream - returns a proper streaming response
    http.get('http://mock.test/api/stream', () => {
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode('Hello'));
                controller.enqueue(encoder.encode(' '));
                controller.enqueue(encoder.encode('Stream'));
                controller.close();
            },
        });
        return new HttpResponse(stream, {
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }),
);

// Retry test state - track attempt counts per endpoint
const retryAttemptCounts: Record<string, number> = {};

function resetRetryAttempts(): void {
    Object.keys(retryAttemptCounts).forEach(key => {
        retryAttemptCounts[key] = 0;
    });
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
    server.resetHandlers();
    resetRetryAttempts();
});
afterAll(() => server.close());

describe('fetchT', () => {
    const baseUrl = 'http://mock.test';

    function expectNonNull<T>(value: T | null): T {
        expect(value).not.toBeNull();
        if (value == null) {
            throw new Error('Expected non-null response body');
        }
        return value;
    }

    // ============ URL Validation Tests ============
    describe('URL validation', () => {
        it('should throw error for invalid url type', () => {
            const url = {};
            expect(() => fetchT(url as string)).toThrow();
        });

        it('should throw TypeError for invalid URL string', () => {
            expect(() => fetchT('not a valid url')).toThrow(TypeError);
            expect(() => fetchT('not a valid url')).toThrow('Invalid URL: not a valid url');
        });

        it('should throw TypeError for relative URL in non-browser environment', () => {
            expect(() => fetchT('/api/data')).toThrow(TypeError);
            expect(() => fetchT('/api/data')).toThrow('Invalid URL: /api/data');
        });

        it('should resolve relative URL in browser environment', async () => {
            // Simulate browser location
            vi.stubGlobal('location', { href: `${ baseUrl }/page` });

            try {
                const res = await fetchT('/api/data');
                expect(res.isOk()).toBe(true);
                res.unwrap().body?.cancel();
            } finally {
                vi.unstubAllGlobals();
            }
        });

        it('should accept URL object', async () => {
            const url = new URL(`${ baseUrl }/api/data`);
            const res = await fetchT(url);
            expect(res.isOk()).toBe(true);
            res.unwrap().body?.cancel();
        });

        it('should accept string url', async () => {
            const res = await fetchT(`${ baseUrl }/api/data`);
            expect(res.isOk()).toBe(true);
            res.unwrap().body?.cancel();
        });
    });

    // ============ Response Type Tests ============
    describe('response types', () => {
        it('should get Response by default', async () => {
            const res = (await fetchT(`${ baseUrl }/api/text`)).unwrap();
            const data = await res.text();
            expect(data).toBe('Hello World');
        });

        it('should get text by responseType', async () => {
            const data = (await fetchT(`${ baseUrl }/api/text`, {
                responseType: 'text',
            })).unwrap();
            expect(data).toBe('Hello World');
        });

        it('should get arraybuffer by responseType', async () => {
            const data = (await fetchT(`${ baseUrl }/api/binary`, {
                responseType: 'arraybuffer',
            })).unwrap();
            expect(data).toBeInstanceOf(ArrayBuffer);
            expect(data.byteLength).toBe(5);
        });

        it('should get blob by responseType', async () => {
            const data = (await fetchT(`${ baseUrl }/api/binary`, {
                responseType: 'blob',
            })).unwrap();
            expect(data).toBeInstanceOf(Blob);
            expect(data.size).toBe(5);
        });

        it('should get json by responseType', async () => {
            const data = expectNonNull((await fetchT<{ id: number; }>(`${ baseUrl }/api/data`, {
                responseType: 'json',
            })).unwrap());
            expect(data.id).toBe(1);
            expect(data).toHaveProperty('title');
        });

        it('should return error for invalid json', async () => {
            const res = await fetchT(`${ baseUrl }/api/invalid-json`, {
                responseType: 'json',
            });
            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as Error).message).toContain('Response is invalid json');
        });

        it('should get stream by responseType', async () => {
            const result = await fetchT(`${ baseUrl }/api/stream`, {
                responseType: 'stream',
            });
            expect(result.isOk()).toBe(true);
            const stream = expectNonNull(result.unwrap());
            expect(stream).toBeInstanceOf(ReadableStream);

            const reader = stream.getReader();
            let text = '';
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                text += decoder.decode(value, { stream: true });
            }

            expect(text).toBe('Hello Stream');
        });

        it('should get bytes (Uint8Array) by responseType', async () => {
            const data = (await fetchT(`${ baseUrl }/api/binary`, {
                responseType: 'bytes',
            })).unwrap();
            expect(data).toBeInstanceOf(Uint8Array);
            expect(data.byteLength).toBe(5);
            expect(data[0]).toBe(1);
            expect(data[4]).toBe(5);
        });

        it('should fallback to arrayBuffer when bytes() is not available', async () => {
            // Save original
            const originalBytes = Response.prototype.bytes;

            // Mock bytes as undefined to test fallback path
            // @ts-expect-error - intentionally removing bytes method
            Response.prototype.bytes = undefined;

            try {
                const result = await fetchT(`${ baseUrl }/api/binary`, {
                    responseType: 'bytes',
                });

                expect(result.isOk()).toBe(true);
                const data = result.unwrap();
                expect(data).toBeInstanceOf(Uint8Array);
                expect(data.byteLength).toBe(5);
                expect(data[0]).toBe(1);
                expect(data[4]).toBe(5);
            } finally {
                // Restore
                Response.prototype.bytes = originalBytes;
            }
        });

        it('should return null stream for HEAD request with stream responseType', async () => {
            const result = await fetchT(`${ baseUrl }/api/data`, {
                method: 'HEAD',
                responseType: 'stream',
            });
            expect(result.isOk()).toBe(true);
            // HEAD response has no body, so stream is null
            expect(result.unwrap()).toBeNull();
        });

        it('should return null json for HEAD request with json responseType', async () => {
            const result = await fetchT<{ id: number; }>(`${ baseUrl }/api/data`, {
                method: 'HEAD',
                responseType: 'json',
            });
            expect(result.isOk()).toBe(true);
            expect(result.unwrap()).toBeNull();
        });

        it('should return null json for 204 response with json responseType', async () => {
            const result = await fetchT<{ ok: boolean; }>(`${ baseUrl }/api/data`, {
                method: 'DELETE',
                responseType: 'json',
            });
            expect(result.isOk()).toBe(true);
            expect(result.unwrap()).toBeNull();
        });
    });

    // ============ HTTP Methods Tests ============
    describe('HTTP methods', () => {
        it('should support HEAD method (no body)', async () => {
            let chunkCalled = false;

            const res = await fetchT(`${ baseUrl }/api/data`, {
                method: 'HEAD',
                onChunk(): void {
                    chunkCalled = true;
                },
            });

            expect(res.isOk()).toBe(true);
            expect(res.unwrap()).toBeInstanceOf(Response);
            expect(chunkCalled).toBe(false);
        });

        it('should support POST method', async () => {
            const data = expectNonNull((await fetchT<{ received: { title: string; }; }>(`${ baseUrl }/api/data`, {
                responseType: 'json',
                method: 'POST',
                body: JSON.stringify({ title: 'test-post' }),
                headers: { 'Content-Type': 'application/json' },
            })).unwrap());

            expect(data.received.title).toBe('test-post');
        });
    });

    // ============ Progress and Chunk Callback Tests ============
    describe('progress and chunk callbacks', () => {
        it('should call onChunk callback', async () => {
            const chunks: Uint8Array[] = [];

            await fetchT(`${ baseUrl }/api/data`, {
                responseType: 'json',
                onChunk(chunk): void {
                    chunks.push(chunk);
                },
            });

            expect(chunks.length).toBeGreaterThan(0);
            expect(chunks[0]).toBeInstanceOf(Uint8Array);
        });

        it('should call onProgress with error when no content-length', async () => {
            let progressCalled = false;
            let gotError = false;

            await fetchT(`${ baseUrl }/api/no-content-length`, {
                responseType: 'json',
                onProgress(progressResult): void {
                    progressCalled = true;
                    if (progressResult.isErr()) {
                        gotError = true;
                        expect(progressResult.unwrapErr().message).toBe('No content-length in response headers.');
                    }
                },
            });

            expect(progressCalled).toBe(true);
            expect(gotError).toBe(true);
        });

        it('should call onProgress with progress when content-length exists', async () => {
            let lastProgress: { totalByteLength: number; completedByteLength: number; } | null = null;

            await fetchT(`${ baseUrl }/api/with-content-length`, {
                responseType: 'json',
                onProgress(progressResult): void {
                    progressResult.inspect(progress => {
                        lastProgress = progress;
                    });
                },
            });

            expect(lastProgress).not.toBeNull();
            expect(lastProgress!.completedByteLength).toBeLessThanOrEqual(lastProgress!.totalByteLength);
        });
    });

    // ============ Timeout Tests ============
    describe('timeout', () => {
        it('should succeed when request completes before timeout', async () => {
            const res = await fetchT(`${ baseUrl }/api/data`, {
                timeout: 5000,
            });

            expect(res.isOk()).toBe(true);
            res.unwrap().body?.cancel();
        });

        it('should throw error for invalid timeout', () => {
            expect(() => fetchT(`${ baseUrl }/api/data`, { timeout: -1 })).toThrow();
        });

        it('should throw error for invalid retries', () => {
            expect(() => fetchT(`${ baseUrl }/api/data`, { retry: -1 })).toThrow(/Retry count must be a non-negative integer/);
            expect(() => fetchT(`${ baseUrl }/api/data`, { retry: 1.5 })).toThrow(/Retry count must be a non-negative integer/);
            expect(() => fetchT(`${ baseUrl }/api/data`, { retry: { retries: -1 } })).toThrow(/Retry count must be a non-negative integer/);
        });

        it('should throw error for invalid responseType', () => {
            // Runtime validation throws for invalid responseType values
            // @ts-expect-error Testing invalid responseType literal (should be compile-time error now)
            expect(() => fetchT(`${ baseUrl }/api/data`, { responseType: 'invalid' })).toThrow(/responseType must be one of/);
        });

        it('should throw error for invalid onProgress', () => {
            // @ts-expect-error Testing invalid onProgress
            expect(() => fetchT(`${ baseUrl }/api/data`, { onProgress: 'not a function' })).toThrow(/onProgress callback must be a function/);
        });

        it('should throw error for invalid onChunk', () => {
            // @ts-expect-error Testing invalid onChunk
            expect(() => fetchT(`${ baseUrl }/api/data`, { onChunk: 123 })).toThrow(/onChunk callback must be a function/);
        });

        it('should throw error for invalid retry delay', () => {
            expect(() => fetchT(`${ baseUrl }/api/data`, { retry: { retries: 1, delay: -100 } })).toThrow(/Retry delay must be a non-negative number/);
            // @ts-expect-error Testing invalid delay type
            expect(() => fetchT(`${ baseUrl }/api/data`, { retry: { retries: 1, delay: 'slow' } })).toThrow(/Retry delay must be a number or a function/);
        });

        it('should throw error for invalid retry when', () => {
            // @ts-expect-error Testing invalid when type
            expect(() => fetchT(`${ baseUrl }/api/data`, { retry: { retries: 1, when: 'always' } })).toThrow(/Retry when condition must be an array of status codes or a function/);
        });

        it('should throw error for invalid onRetry', () => {
            // @ts-expect-error Testing invalid onRetry type
            expect(() => fetchT(`${ baseUrl }/api/data`, { retry: { retries: 1, onRetry: 'callback' } })).toThrow(/Retry onRetry callback must be a function/);
        });

        it('should throw error for zero timeout', () => {
            expect(() => fetchT(`${ baseUrl }/api/data`, { timeout: 0 })).toThrow();
        });

        it('should abort fetch by timeout', async () => {
            const res = await fetchT(`${ baseUrl }/api/slow`, {
                timeout: 50,
            });

            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as Error).name).toBe(TIMEOUT_ERROR);
        });

        it('should abort stream fetch by timeout', async () => {
            const res = await fetchT(`${ baseUrl }/api/slow`, {
                timeout: 50,
                responseType: 'stream',
            });

            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as Error).name).toBe(TIMEOUT_ERROR);
        });

        it('should abort abortable fetch by timeout', async () => {
            const fetchTask = fetchT(`${ baseUrl }/api/slow`, {
                abortable: true,
                timeout: 50,
            });

            const res = await fetchTask.response;
            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as Error).name).toBe(TIMEOUT_ERROR);
            // Note: aborted remains false because timeout signal is separate from masterController
            // The timeout is handled by AbortSignal.timeout(), not by calling fetchTask.abort()
        });
    });

    // ============ Abort Tests ============
    describe('abort', () => {
        it('should abort fetch with default reason', async () => {
            const fetchTask = fetchT(`${ baseUrl }/api/slow`, {
                abortable: true,
            });

            setTimeout(() => fetchTask.abort(), 50);

            const res = await fetchTask.response;
            expect((res.unwrapErr() as Error).name).toBe(ABORT_ERROR);
            expect(fetchTask.aborted).toBe(true);
        });

        it('should abort fetch with custom reason', async () => {
            const fetchTask = fetchT(`${ baseUrl }/api/slow`, {
                abortable: true,
            });

            setTimeout(() => fetchTask.abort('custom-cancel'), 50);

            const res = await fetchTask.response;
            const err = res.unwrapErr() as Error;
            expect(err.name).toBe(ABORT_ERROR);
            expect(err.message).toBe('custom-cancel');
            expect(err.cause).toBe('custom-cancel');
        });

        it('should abort stream fetch with default reason', async () => {
            const fetchTask = fetchT(`${ baseUrl }/api/slow`, {
                abortable: true,
                responseType: 'stream',
            });

            setTimeout(() => fetchTask.abort(), 50);

            const res = await fetchTask.response;
            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as Error).name).toBe(ABORT_ERROR);
            expect(fetchTask.aborted).toBe(true);
        });

        it('should abort stream fetch with custom reason', async () => {
            const fetchTask = fetchT(`${ baseUrl }/api/slow`, {
                abortable: true,
                responseType: 'stream',
            });

            setTimeout(() => fetchTask.abort('stream-cancelled'), 50);

            const res = await fetchTask.response;
            expect(res.isErr()).toBe(true);
            const err = res.unwrapErr() as Error;
            expect(err.name).toBe(ABORT_ERROR);
            expect(err.message).toBe('stream-cancelled');
            expect(err.cause).toBe('stream-cancelled');
        });

        it('should return FetchTask when abortable is true', () => {
            const fetchTask = fetchT(`${ baseUrl }/api/data`, {
                abortable: true,
            });

            expect(fetchTask).toHaveProperty('abort');
            expect(fetchTask).toHaveProperty('aborted');
            expect(fetchTask).toHaveProperty('response');
            expect(typeof fetchTask.abort).toBe('function');
            expect(typeof fetchTask.aborted).toBe('boolean');
            expect(fetchTask.aborted).toBe(false);

            fetchTask.abort();
            expect(fetchTask.aborted).toBe(true);
        });

        it('should abort fetch with Error reason', async () => {
            const fetchTask = fetchT(`${ baseUrl }/api/slow`, {
                abortable: true,
            });

            const customError = new Error('custom-error');
            customError.name = 'CustomError';
            setTimeout(() => fetchTask.abort(customError), 50);

            const res = await fetchTask.response;
            const err = res.unwrapErr() as Error;
            expect(err).toBe(customError);
            expect(err.name).toBe('CustomError');
            expect(err.message).toBe('custom-error');
        });

        it('should handle external signal abort with string reason', async () => {
            const externalController = new AbortController();

            const response = fetchT(`${ baseUrl }/api/slow`, {
                signal: externalController.signal,
                responseType: 'text',
            });

            // Abort with a string reason via external controller
            setTimeout(() => externalController.abort('external-abort-reason'), 50);

            const res = await response;
            expect(res.isErr()).toBe(true);
            const err = res.unwrapErr() as Error;
            expect(err.name).toBe(ABORT_ERROR);
            expect(err.message).toBe('external-abort-reason');
            expect(err.cause).toBe('external-abort-reason');
        });

        it('should handle external signal abort with non-string reason', async () => {
            const externalController = new AbortController();

            const response = fetchT(`${ baseUrl }/api/slow`, {
                signal: externalController.signal,
                responseType: 'text',
            });

            // Abort with a non-string reason (number) via external controller
            setTimeout(() => externalController.abort(42), 50);

            const res = await response;
            expect(res.isErr()).toBe(true);
            const err = res.unwrapErr() as Error;
            expect(err.name).toBe(ABORT_ERROR);
            expect(err.message).toBe('42');
            expect(err.cause).toBe(42);
        });

        it('should abort fetch with non-string reason', async () => {
            const fetchTask = fetchT(`${ baseUrl }/api/slow`, {
                abortable: true,
            });

            // Abort with a non-string reason (object)
            const reason = { code: 'CANCELLED', id: 123 };
            setTimeout(() => fetchTask.abort(reason), 50);

            const res = await fetchTask.response;
            const err = res.unwrapErr() as Error;
            expect(err.name).toBe(ABORT_ERROR);
            expect(err.message).toBe('[object Object]');
            expect(err.cause).toBe(reason);
        });
    });

    // ============ Error Handling Tests ============
    describe('error handling', () => {
        it('should return FetchError for 404 response', async () => {
            const res = await fetchT(`${ baseUrl }/api/404`);

            expect(res.isErr()).toBe(true);
            const err = res.unwrapErr();
            expect(err).toBeInstanceOf(FetchError);
            expect((err as FetchError).status).toBe(404);
            expect((err as FetchError).message).toBe('Not Found');
        });

        it('should return FetchError for 500 response', async () => {
            const res = await fetchT(`${ baseUrl }/api/500`);

            expect(res.isErr()).toBe(true);
            const err = res.unwrapErr();
            expect(err).toBeInstanceOf(FetchError);
            expect((err as FetchError).status).toBe(500);
        });

        it('should handle network errors', async () => {
            server.use(
                http.get('http://mock.test/api/network-error', () => {
                    return HttpResponse.error();
                }),
            );

            const res = await fetchT(`${ baseUrl }/api/network-error`);
            expect(res.isErr()).toBe(true);
        });

        it('should silently ignore body.cancel() errors on non-ok response', async () => {
            // This test verifies that the .catch() on response.body?.cancel() works correctly.
            // We directly mock fetch to return a Response with a body that rejects on cancel.
            let catchExecuted = false;

            const mockStream = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('error body'));
                    controller.close();
                },
                cancel() {
                    catchExecuted = true;
                    return Promise.reject(new Error('Mock cancel error'));
                },
            });

            const mockResponse = new Response(mockStream, {
                status: 500,
                statusText: 'Internal Server Error',
            });

            const originalFetch = globalThis.fetch;
            globalThis.fetch = vi.fn().mockResolvedValue(mockResponse);

            try {
                const res = await fetchT('http://any-url.test/api/error');

                // Should return FetchError without unhandled rejection
                expect(res.isErr()).toBe(true);
                const err = res.unwrapErr();
                expect(err).toBeInstanceOf(FetchError);
                expect((err as FetchError).status).toBe(500);

                // Wait for the cancel promise rejection to be handled
                await new Promise(resolve => setTimeout(resolve, 10));
                expect(catchExecuted).toBe(true);
            } finally {
                globalThis.fetch = originalFetch;
            }
        });
    });

    // ============ FetchTask with different responseTypes ============
    describe('FetchTask with responseTypes', () => {
        it('should return FetchTask<string> for text responseType', async () => {
            const fetchTask = fetchT(`${ baseUrl }/api/text`, {
                abortable: true,
                responseType: 'text',
            });

            const res = await fetchTask.response;
            expect(res.isOk()).toBe(true);
            expect(res.unwrap()).toBe('Hello World');
        });

        it('should return FetchTask<ArrayBuffer> for arraybuffer responseType', async () => {
            const fetchTask = fetchT(`${ baseUrl }/api/binary`, {
                abortable: true,
                responseType: 'arraybuffer',
            });

            const res = await fetchTask.response;
            expect(res.isOk()).toBe(true);
            expect(res.unwrap()).toBeInstanceOf(ArrayBuffer);
        });

        it('should return FetchTask<Blob> for blob responseType', async () => {
            const fetchTask = fetchT(`${ baseUrl }/api/binary`, {
                abortable: true,
                responseType: 'blob',
            });

            const res = await fetchTask.response;
            expect(res.isOk()).toBe(true);
            expect(res.unwrap()).toBeInstanceOf(Blob);
        });

        it('should return FetchTask<T> for json responseType', async () => {
            const fetchTask = fetchT<{ id: number; }>(`${ baseUrl }/api/data`, {
                abortable: true,
                responseType: 'json',
            });

            const res = await fetchTask.response;
            expect(res.isOk()).toBe(true);
            expect(expectNonNull(res.unwrap()).id).toBe(1);
        });

        it('should return FetchTask<ReadableStream> for stream responseType', async () => {
            const fetchTask = fetchT(`${ baseUrl }/api/data`, {
                abortable: true,
                responseType: 'stream',
            });

            const res = await fetchTask.response;
            expect(res.isOk()).toBe(true);
            const stream = res.unwrap();
            expect(stream).toBeInstanceOf(ReadableStream);

            // Clean up stream
            stream?.cancel().catch(() => {});
        });

        it('should return FetchTask<Uint8Array> for bytes responseType', async () => {
            const fetchTask = fetchT(`${ baseUrl }/api/binary`, {
                abortable: true,
                responseType: 'bytes',
            });

            const res = await fetchTask.response;
            expect(res.isOk()).toBe(true);
            const data = res.unwrap();
            expect(data).toBeInstanceOf(Uint8Array);
            expect(data.byteLength).toBe(5);
        });
    });

    // ============ Callback Error Handling Tests ============
    describe('callback error handling', () => {
        it('should silently ignore errors thrown by onChunk callback', async () => {
            let callCount = 0;

            const res = await fetchT(`${ baseUrl }/api/data`, {
                responseType: 'json',
                onChunk() {
                    callCount++;
                    throw new Error('onChunk callback error');
                },
            });

            // Request should succeed despite callback errors
            expect(res.isOk()).toBe(true);
            expect(callCount).toBeGreaterThan(0);
        });

        it('should silently ignore errors thrown by onProgress callback', async () => {
            let callCount = 0;

            const res = await fetchT(`${ baseUrl }/api/with-content-length`, {
                responseType: 'json',
                onProgress() {
                    callCount++;
                    throw new Error('onProgress callback error');
                },
            });

            // Request should succeed despite callback errors
            expect(res.isOk()).toBe(true);
            expect(callCount).toBeGreaterThan(0);
        });

        it('should silently ignore errors thrown by onProgress when no content-length', async () => {
            let callCount = 0;

            const res = await fetchT(`${ baseUrl }/api/no-content-length`, {
                responseType: 'json',
                onProgress() {
                    callCount++;
                    throw new Error('onProgress callback error');
                },
            });

            // Request should succeed despite callback errors
            expect(res.isOk()).toBe(true);
            expect(callCount).toBeGreaterThan(0);
        });

        it('should handle stream read errors without unhandled rejection', async () => {
            const chunks: string[] = [];

            const res = await fetchT(`${ baseUrl }/api/stream-error`, {
                responseType: 'text',
                onChunk(chunk) {
                    chunks.push(new TextDecoder().decode(chunk));
                },
            });

            // Stream error should be caught and returned as Err
            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as Error).message).toBe('Stream read error');
            // At least one chunk should have been received before error
            expect(chunks.length).toBeGreaterThan(0);
        });

        it('should handle immediate stream read errors without unhandled rejection', async () => {
            let chunkCalled = false;

            const res = await fetchT(`${ baseUrl }/api/stream-error-immediate`, {
                responseType: 'text',
                onChunk() {
                    chunkCalled = true;
                },
            });

            // Stream error should be caught and returned as Err
            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as Error).message).toBe('Immediate stream error');
            // No chunks should have been received
            expect(chunkCalled).toBe(false);
        });
    });

    // ============ Retry Tests ============
    describe('retry', () => {
        it('should retry on network error and succeed', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-network', () => {
                    attemptCount++;
                    if (attemptCount < 3) {
                        return HttpResponse.error();
                    }
                    return HttpResponse.json({ success: true });
                }),
            );

            const res = await fetchT<{ success: boolean; }>(`${ baseUrl }/api/retry-network`, {
                retry: 3,
                responseType: 'json',
            });

            expect(res.isOk()).toBe(true);
            expect(expectNonNull(res.unwrap()).success).toBe(true);
            expect(attemptCount).toBe(3);
        });

        it('should not retry on HTTP error by default', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-http-error', () => {
                    attemptCount++;
                    return new HttpResponse(null, { status: 500, statusText: 'Server Error' });
                }),
            );

            const res = await fetchT(`${ baseUrl }/api/retry-http-error`, {
                retry: 3,
                responseType: 'json',
            });

            expect(res.isErr()).toBe(true);
            expect(res.unwrapErr()).toBeInstanceOf(FetchError);
            expect((res.unwrapErr() as FetchError).status).toBe(500);
            // Should only try once (no retry for HTTP errors by default)
            expect(attemptCount).toBe(1);
        });

        it('should retry on specific HTTP status codes when configured', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-status', () => {
                    attemptCount++;
                    if (attemptCount < 3) {
                        return new HttpResponse(null, { status: 503, statusText: 'Service Unavailable' });
                    }
                    return HttpResponse.json({ success: true });
                }),
            );

            const res = await fetchT<{ success: boolean; }>(`${ baseUrl }/api/retry-status`, {
                retry: {
                    retries: 3,
                    when: [500, 502, 503, 504],
                },
                responseType: 'json',
            });

            expect(res.isOk()).toBe(true);
            expect(expectNonNull(res.unwrap()).success).toBe(true);
            expect(attemptCount).toBe(3);
        });

        it('should not retry on non-matching HTTP status codes', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-404', () => {
                    attemptCount++;
                    return new HttpResponse(null, { status: 404, statusText: 'Not Found' });
                }),
            );

            const res = await fetchT(`${ baseUrl }/api/retry-404`, {
                retry: {
                    retries: 3,
                    when: [500, 502, 503, 504],
                },
                responseType: 'json',
            });

            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as FetchError).status).toBe(404);
            expect(attemptCount).toBe(1);
        });

        it('should retry with custom condition function', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-custom', () => {
                    attemptCount++;
                    if (attemptCount < 2) {
                        return new HttpResponse(null, { status: 429, statusText: 'Too Many Requests' });
                    }
                    return HttpResponse.json({ success: true });
                }),
            );

            const res = await fetchT<{ success: boolean; }>(`${ baseUrl }/api/retry-custom`, {
                retry: {
                    retries: 3,
                    when: (error, _attempt) => {
                        return error instanceof FetchError && error.status === 429;
                    },
                },
                responseType: 'json',
            });

            expect(res.isOk()).toBe(true);
            expect(expectNonNull(res.unwrap()).success).toBe(true);
            expect(attemptCount).toBe(2);
        });

        it('should apply static retry delay', async () => {
            let attemptCount = 0;
            const timestamps: number[] = [];

            server.use(
                http.get('http://mock.test/api/retry-delay', () => {
                    attemptCount++;
                    timestamps.push(Date.now());
                    if (attemptCount < 3) {
                        return HttpResponse.error();
                    }
                    return HttpResponse.json({ success: true });
                }),
            );

            const res = await fetchT<{ success: boolean; }>(`${ baseUrl }/api/retry-delay`, {
                retry: {
                    retries: 3,
                    delay: 50,
                },
                responseType: 'json',
            });

            expect(res.isOk()).toBe(true);
            expect(attemptCount).toBe(3);
            // Check delays between attempts (with some tolerance)
            expect(timestamps[1] - timestamps[0]).toBeGreaterThanOrEqual(45);
            expect(timestamps[2] - timestamps[1]).toBeGreaterThanOrEqual(45);
        });

        it('should apply dynamic retry delay (exponential backoff)', async () => {
            let attemptCount = 0;
            const timestamps: number[] = [];

            server.use(
                http.get('http://mock.test/api/retry-backoff', () => {
                    attemptCount++;
                    timestamps.push(Date.now());
                    if (attemptCount < 3) {
                        return HttpResponse.error();
                    }
                    return HttpResponse.json({ success: true });
                }),
            );

            const res = await fetchT<{ success: boolean; }>(`${ baseUrl }/api/retry-backoff`, {
                retry: {
                    retries: 3,
                    delay: (attempt) => 25 * attempt, // 25ms, 50ms, 75ms
                },
                responseType: 'json',
            });

            expect(res.isOk()).toBe(true);
            expect(attemptCount).toBe(3);
            // First retry delay should be ~25ms, second should be ~50ms
            expect(timestamps[1] - timestamps[0]).toBeGreaterThanOrEqual(20);
            expect(timestamps[2] - timestamps[1]).toBeGreaterThanOrEqual(45);
        });

        it('should call onRetry callback before each retry', async () => {
            let attemptCount = 0;
            const retryCallbacks: { attempt: number; error: Error; }[] = [];

            server.use(
                http.get('http://mock.test/api/retry-callback', () => {
                    attemptCount++;
                    if (attemptCount < 3) {
                        return HttpResponse.error();
                    }
                    return HttpResponse.json({ success: true });
                }),
            );

            const res = await fetchT<{ success: boolean; }>(`${ baseUrl }/api/retry-callback`, {
                retry: {
                    retries: 3,
                    onRetry: (error, attempt) => {
                        retryCallbacks.push({ attempt, error });
                    },
                },
                responseType: 'json',
            });

            expect(res.isOk()).toBe(true);
            expect(retryCallbacks.length).toBe(2); // Called before 2nd and 3rd attempts
            expect(retryCallbacks[0].attempt).toBe(1);
            expect(retryCallbacks[1].attempt).toBe(2);
        });

        it('should silently ignore onRetry callback errors', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-callback-error', () => {
                    attemptCount++;
                    if (attemptCount < 2) {
                        return HttpResponse.error();
                    }
                    return HttpResponse.json({ success: true });
                }),
            );

            const res = await fetchT<{ success: boolean; }>(`${ baseUrl }/api/retry-callback-error`, {
                retry: {
                    retries: 3,
                    onRetry: () => {
                        throw new Error('onRetry error');
                    },
                },
                responseType: 'json',
            });

            expect(res.isOk()).toBe(true);
            expect(attemptCount).toBe(2);
        });

        it('should stop retrying when user aborts', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-abort', async () => {
                    attemptCount++;
                    // Simulate slow response to give time for abort
                    await new Promise(r => setTimeout(r, 100));
                    return HttpResponse.error();
                }),
            );

            const task = fetchT(`${ baseUrl }/api/retry-abort`, {
                abortable: true,
                retry: 5,
                responseType: 'json',
            });

            // Abort after first attempt starts
            setTimeout(() => task.abort(), 50);

            const res = await task.response;

            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as Error).name).toBe(ABORT_ERROR);
            expect(attemptCount).toBe(1);
        });

        it('should continue retrying after timeout (per-attempt timeout)', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-timeout', async () => {
                    attemptCount++;
                    if (attemptCount < 2) {
                        // First attempt times out
                        await new Promise(r => setTimeout(r, 200));
                    }
                    return HttpResponse.json({ success: true });
                }),
            );

            const res = await fetchT<{ success: boolean; }>(`${ baseUrl }/api/retry-timeout`, {
                retry: {
                    retries: 3,
                    when: (error, _attempt) => error.name === TIMEOUT_ERROR,
                },
                timeout: 50,
                responseType: 'json',
            });

            expect(res.isOk()).toBe(true);
            expect(expectNonNull(res.unwrap()).success).toBe(true);
            expect(attemptCount).toBe(2);
        });

        it('should return last error when all retries fail', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-all-fail', () => {
                    attemptCount++;
                    return HttpResponse.error();
                }),
            );

            const res = await fetchT(`${ baseUrl }/api/retry-all-fail`, {
                retry: 2,
                responseType: 'json',
            });

            expect(res.isErr()).toBe(true);
            expect(attemptCount).toBe(3); // Initial + 2 retries
        });

        it('should not retry when retry is 0', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-zero', () => {
                    attemptCount++;
                    return HttpResponse.error();
                }),
            );

            const res = await fetchT(`${ baseUrl }/api/retry-zero`, {
                retry: 0,
                responseType: 'json',
            });

            expect(res.isErr()).toBe(true);
            expect(attemptCount).toBe(1);
        });

        it('should work with progress and chunk callbacks during retry', async () => {
            let attemptCount = 0;
            const chunks: Uint8Array[] = [];

            server.use(
                http.get('http://mock.test/api/retry-with-callbacks', () => {
                    attemptCount++;
                    if (attemptCount < 2) {
                        return HttpResponse.error();
                    }
                    return new HttpResponse('success data', {
                        headers: {
                            'Content-Type': 'text/plain',
                            'Content-Length': '12',
                        },
                    });
                }),
            );

            const res = await fetchT(`${ baseUrl }/api/retry-with-callbacks`, {
                retry: 3,
                responseType: 'text',
                onChunk: (chunk) => chunks.push(chunk),
            });

            expect(res.isOk()).toBe(true);
            expect(res.unwrap()).toBe('success data');
            expect(attemptCount).toBe(2);
            // Chunks should be received on successful attempt
            expect(chunks.length).toBeGreaterThan(0);
        });

        it('should abort during retry delay', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-abort-delay', () => {
                    attemptCount++;
                    return HttpResponse.error();
                }),
            );

            const task = fetchT(`${ baseUrl }/api/retry-abort-delay`, {
                abortable: true,
                retry: {
                    retries: 3,
                    delay: 500, // Long delay
                },
                responseType: 'json',
            });

            // Abort during retry delay (after first attempt fails)
            setTimeout(() => task.abort(), 100);

            const res = await task.response;

            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as Error).name).toBe(ABORT_ERROR);
            expect(attemptCount).toBe(1);
        });

        it('should abort immediately if aborted before fetch starts', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-abort-immediate', async () => {
                    attemptCount++;
                    // Slow response to ensure abort happens during fetch
                    await new Promise(r => setTimeout(r, 100));
                    return HttpResponse.json({ success: true });
                }),
            );

            const task = fetchT(`${ baseUrl }/api/retry-abort-immediate`, {
                abortable: true,
                retry: 3,
                responseType: 'json',
            });

            // Abort immediately - the fetch may have started but should abort
            task.abort();

            const res = await task.response;

            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as Error).name).toBe(ABORT_ERROR);
            // First fetch attempt may have started, but should abort
            expect(attemptCount).toBeLessThanOrEqual(1);
        });

        it('should abort on second attempt if aborted during first attempt', async () => {
            let attemptCount = 0;
            // eslint-disable-next-line prefer-const
            let task: FetchTask<{ success: boolean; } | null>;

            server.use(
                http.get('http://mock.test/api/retry-abort-second', async () => {
                    attemptCount++;
                    if (attemptCount === 1) {
                        // First attempt: abort during this request, then return network error
                        task.abort();
                        return HttpResponse.error();
                    }
                    // Second attempt should not reach here
                    return HttpResponse.json({ success: true });
                }),
            );

            task = fetchT<{ success: boolean; }>(`${ baseUrl }/api/retry-abort-second`, {
                abortable: true,
                retry: {
                    retries: 3,
                    delay: 0, // No delay to speed up test
                },
                responseType: 'json',
            });

            const res = await task.response;

            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as Error).name).toBe(ABORT_ERROR);
            expect(attemptCount).toBe(1); // Only first attempt should run
        });

        it('should abort before retry delay starts', async () => {
            let attemptCount = 0;
            let onRetryCalled = false;

            server.use(
                http.get('http://mock.test/api/retry-abort-before-delay', () => {
                    attemptCount++;
                    return HttpResponse.error();
                }),
            );

            const task = fetchT(`${ baseUrl }/api/retry-abort-before-delay`, {
                abortable: true,
                retry: {
                    retries: 3,
                    delay: 1000, // Long delay - should never reach this
                    onRetry: () => {
                        // Abort right when onRetry is called (before delay)
                        onRetryCalled = true;
                        task.abort();
                    },
                },
                responseType: 'json',
            });

            const res = await task.response;

            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as Error).name).toBe(ABORT_ERROR);
            expect(attemptCount).toBe(1); // Only first attempt
            expect(onRetryCalled).toBe(true); // onRetry was called
        });

        it('should detect abort before doFetch starts on retry attempt (line 328-330)', async () => {
            // This test covers the abort check at the START of doFetch (lines 328-330)
            // The key is to abort AFTER first attempt completes but BEFORE second doFetch begins
            let attemptCount = 0;
            // eslint-disable-next-line prefer-const
            let task: FetchTask<{ success: boolean; } | null>;

            server.use(
                http.get('http://mock.test/api/retry-abort-before-dofetch', async () => {
                    attemptCount++;
                    if (attemptCount === 1) {
                        // First attempt: return network error to trigger retry
                        // But abort right before returning so abort is set when retry loop checks
                        task.abort();
                        return HttpResponse.error();
                    }
                    // Should not reach here
                    return HttpResponse.json({ success: true });
                }),
            );

            task = fetchT<{ success: boolean; }>(`${ baseUrl }/api/retry-abort-before-dofetch`, {
                abortable: true,
                retry: {
                    retries: 3,
                    delay: 0, // No delay
                },
                responseType: 'json',
            });

            const res = await task.response;

            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as Error).name).toBe(ABORT_ERROR);
            expect(attemptCount).toBe(1);
        });

        it('should detect abort at start of retry loop (line 483-485)', async () => {
            // This test specifically covers lines 483-485: abort check at START of retry loop
            // Strategy:
            // 1. First request fails with network error (not abort)
            // 2. shouldRetry returns true, attempt++, loop continues
            // 3. At the check point (line 483), abort should already be true
            //
            // The trick: abort in the retryOn callback (which runs AFTER shouldRetry check in while condition)
            // Then next iteration will hit line 483-485
            let attemptCount = 0;
            let onRetryCalled = false;
            let retryOnCallCount = 0;
            let taskRef: FetchTask<{ success: boolean; } | null> | null = null;
            server.use(
                http.get('http://mock.test/api/retry-abort-at-loop-start', () => {
                    attemptCount++;
                    // Always return network error
                    return HttpResponse.error();
                }),
            );

            const task = fetchT<{ success: boolean; }>(`${ baseUrl }/api/retry-abort-at-loop-start`, {
                abortable: true,
                retry: {
                    retries: 3,
                    delay: 0,
                    when: (_error, _attempt) => {
                        retryOnCallCount++;
                        if (retryOnCallCount === 1) {
                            // First retry check: abort synchronously and return true
                            // This way: shouldRetry returns true, but abort is set
                            // Next iteration of the loop will hit the abort check at line 483
                            taskRef?.abort();
                            return true;
                        }
                        return true;
                    },
                    onRetry: () => {
                        onRetryCalled = true;
                    },
                },
                responseType: 'json',
            });

            taskRef = task;

            const res = await task.response;

            expect(res.isErr()).toBe(true);
            expect((res.unwrapErr() as Error).name).toBe(ABORT_ERROR);
            expect(attemptCount).toBe(1);
            // onRetry should NOT be called because abort was detected before it
            expect(onRetryCalled).toBe(false);
        });

        it('should default to 0 retries when retry option is missing', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-missing', () => {
                    attemptCount++;
                    return HttpResponse.error();
                }),
            );

            const res = await fetchT(`${ baseUrl }/api/retry-missing`, {
                responseType: 'json',
            });

            expect(res.isErr()).toBe(true);
            expect(attemptCount).toBe(1);
        });

        it('should ignore invalid retry option type', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-invalid-type', () => {
                    attemptCount++;
                    return HttpResponse.error();
                }),
            );

            const res = await fetchT(`${ baseUrl }/api/retry-invalid-type`, {
                responseType: 'json',
                retry: 'invalid' as unknown as number,
            });

            expect(res.isErr()).toBe(true);
            expect(attemptCount).toBe(1);
        });

        it('should handle empty retry object (defaults to 0 retries)', async () => {
            let attemptCount = 0;

            server.use(
                http.get('http://mock.test/api/retry-empty', () => {
                    attemptCount++;
                    return HttpResponse.error();
                }),
            );

            const res = await fetchT(`${ baseUrl }/api/retry-empty`, {
                retry: {},
                responseType: 'json',
            });

            expect(res.isErr()).toBe(true);
            expect(attemptCount).toBe(1);
        });
    });
});
