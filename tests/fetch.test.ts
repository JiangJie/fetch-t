import { assert, assertThrows } from '@std/assert';
import { ABORT_ERROR, FetchError, fetchT, TIMEOUT_ERROR } from '../src/mod.ts';

Deno.test('fetch', async (t) => {
    const mockServer = 'https://fakestoreapi.com';
    const mockAll = `${ mockServer }/products`;
    const mockSingle = `${ mockAll }/1`;
    const mockNotFound = `${ mockServer }/not_found`;
    const mockInvalidJson = `https://github.com/JiangJie/fetch-t`;

    await t.step('Invalid url will throw', () => {
        const url = {};
        assertThrows(() => fetchT((url as string)), Error);
    });

    await t.step('Get Response by default', async () => {
        const res = (await fetchT(mockSingle)).unwrap();
        const data = await res.text();

        assert(typeof data === 'string');
    });

    await t.step('Get Response by RequestInit', async () => {
        const res = (await fetchT(mockSingle, {
            mode: 'no-cors',
        } as RequestInit)).unwrap();
        const data = await res.text();

        assert(typeof data === 'string');
    });

    await t.step('Get text by response type', async () => {
        const data = (await fetchT(mockSingle, {
            responseType: 'text',
        })).unwrap();

        assert(typeof data === 'string');
    });

    await t.step('Get arraybuffer by response type', async () => {
        const data = (await fetchT(mockSingle, {
            responseType: 'arraybuffer',
        })).unwrap();

        assert(data instanceof ArrayBuffer);
    });

    await t.step('Get blob by response type', async () => {
        const data = (await fetchT(mockSingle, {
            responseType: 'blob',
        })).unwrap();

        assert(data instanceof Blob);
    });

    await t.step('Get json by response type', async () => {
        const data = (await fetchT<{ id: number }>(mockSingle, {
            responseType: 'json',
            method: 'GET',
            onChunk(chunk): void {
                assert(chunk instanceof Uint8Array);
            },
            onProgress(progressResult): void {
                assert(progressResult.isErr());
                assert(progressResult.unwrapErr() instanceof Error);
                assert(progressResult.unwrapErr().message === 'No content-length in response headers.');
            },
        })).unwrap();

        assert('id' in data);
    });

    await t.step('Post json', async () => {
        const data = (await fetchT<{
            title: string;
        }>(mockAll, {
            responseType: 'json',
            method: 'POST',
            body: JSON.stringify({
                title: 'happy-2',
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            onChunk(chunk): void {
                assert(chunk instanceof Uint8Array);
            },
            onProgress(progressResult): void {
                // assert(progressResult.isOk());
                progressResult.inspect(x => {
                    assert(x.completedByteLength <= x.totalByteLength);
                })
            },
        })).unwrap();

        assert(data.title === 'happy-2');
    });

    await t.step('Put json', async () => {
        const data = (await fetchT<{
            title: string;
        }>(mockSingle, {
            responseType: 'json',
            method: 'PUT',
            body: JSON.stringify({
                title: 'happy-new',
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })).unwrap();

        assert(data.title === 'happy-new');
    });

    await t.step('Patch json', async () => {
        const data = (await fetchT<{
            title: string;
        }>(mockSingle, {
            responseType: 'json',
            method: 'PATCH',
            body: JSON.stringify({
                title: 'happy-new',
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })).unwrap();

        assert(data.title === 'happy-new');
    });

    await t.step('Delete json', async () => {
        const data = (await fetchT<{
            title: boolean;
        }>(mockSingle, {
            responseType: 'json',
            method: 'DELETE',
        })).unwrap();

        assert('title' in data);
    });

    await t.step('Get invalid json', async () => {
        const res = (await fetchT(mockInvalidJson, {
            responseType: 'json',
        }));

        assert((res.unwrapErr() as Error).message.includes(`Response is invalid json`));
    });

    await t.step('Ignore timeout when success', async () => {
        const res = await fetchT(mockSingle, {
            timeout: 10000,
        });

        assert(res.isOk());
        // Leak risk
        res.unwrap().body?.cancel();
    });

    await t.step('Abort fetch by default', async () => {
        const fetchTask = fetchT(mockSingle, {
            abortable: true,
            timeout: 1000,
        });

        setTimeout(() => {
            fetchTask.abort();
        }, 100);

        const res = await fetchTask.response;
        assert((res.unwrapErr() as Error).name === ABORT_ERROR);
        assert(fetchTask.aborted);
    });

    await t.step('Abort fetch by custom', async () => {
        const fetchTask = fetchT(mockSingle, {
            abortable: true,
            timeout: 1000,
        });

        const timer = setTimeout(() => {
            fetchTask.abort('cancel');
        }, 500);

        const res = await fetchTask.response;

        res.inspect((x) => {
            clearTimeout(timer);
            x.body?.cancel();
        }).inspectErr(err => {
            assert((err as string) === 'cancel');
        });
    });

    await t.step('Invalid timeout', () => {
        assertThrows(() => fetchT(mockSingle, {
            timeout: -1,
        }), Error);
    });

    await t.step('Abort fetch by timeout', async () => {
        const res = await fetchT(mockSingle, {
            timeout: 1,
        });

        assert(res.isErr());
        assert((res.unwrapErr() as Error).name === TIMEOUT_ERROR);
    });

    await t.step('Fetch not found', async () => {
        const err: Error = (await fetchT(mockNotFound)).unwrapErr();
        assert(err.name === 'FetchError');
        assert(err.message === 'Not Found');
        assert((err as FetchError).status === 404);
    });
});