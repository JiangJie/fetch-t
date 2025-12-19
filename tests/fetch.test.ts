import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { ABORT_ERROR, FetchError, fetchT, TIMEOUT_ERROR } from '../src/mod.ts';

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
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('fetchT', () => {
    const baseUrl = 'http://mock.test';

    // ============ URL Validation Tests ============
    describe('URL validation', () => {
        it('should throw error for invalid url', () => {
            const url = {};
            expect(() => fetchT(url as string)).toThrow();
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
            const data = (await fetchT<{ id: number; }>(`${ baseUrl }/api/data`, {
                responseType: 'json',
            })).unwrap();
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
            const data = (await fetchT<{ received: { title: string; }; }>(`${ baseUrl }/api/data`, {
                responseType: 'json',
                method: 'POST',
                body: JSON.stringify({ title: 'test-post' }),
                headers: { 'Content-Type': 'application/json' },
            })).unwrap();

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
            expect(res.unwrapErr()).toBe('custom-cancel');
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
            expect(res.unwrap().id).toBe(1);
        });
    });
});
