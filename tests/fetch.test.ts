import { assert, assertThrows } from '@std/assert';
import { ABORT_ERROR, TIMEOUT_ERROR } from "../src/fetch/defines.ts";
import { fetchT } from '../src/mod.ts';

Deno.test('fetch', async (t) => {
    const mockServer = 'https://16a6dafa-2258-4a83-88fa-31a409e42b17.mock.pstmn.io';
    const mockTodos = `${ mockServer }/todos`;
    const mockTodo1 = `${ mockTodos }/1`;
    const mockInvalidJson = `${ mockServer }/invalid_json`;
    const mockNotFound = `${ mockServer }/not_found`;

    await t.step('Invalid url will throw', () => {
        const url = null;
        assertThrows(() => fetchT(url!), Error);
    });

    await t.step('Get Response by default', async () => {
        const res = (await fetchT(mockTodos)).unwrap();
        const data = await res.text();

        assert(data.includes(`"id": 1`));
    });

    await t.step('Get Response by RequestInit', async () => {
        const res = (await fetchT(mockTodo1, {
            mode: 'no-cors',
        } as RequestInit)).unwrap();
        const data = await res.text();

        assert(data.includes(`"id": 1`));
    });

    await t.step('Get text by response type', async () => {
        const data = (await fetchT(mockTodo1, {
            responseType: 'text',
        })).unwrap();

        assert(data.includes(`"id": 1`));
    });

    await t.step('Get arraybuffer by response type', async () => {
        const data = (await fetchT(mockTodo1, {
            responseType: 'arraybuffer',
        })).unwrap();

        assert(data.byteLength === 37);
    });

    await t.step('Get blob by response type', async () => {
        const data = (await fetchT(mockTodo1, {
            responseType: 'blob',
        })).unwrap();

        assert(data.size === 37);
    });

    await t.step('Get json by response type', async () => {
        const data = (await fetchT<{ id: number }[]>(mockTodos, {
            responseType: 'json',
            method: 'GET',
        })).unwrap();

        assert(data.length === 1);
        assert(data[0].id === 1);
    });

    await t.step('Post json', async () => {
        const data = (await fetchT<{
            id: number;
        }>(mockTodos, {
            responseType: 'json',
            method: 'POST',
            body: JSON.stringify({
                title: 'happy-2',
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })).unwrap();

        assert(data.id === 2);
    });

    await t.step('Put json', async () => {
        const data = (await fetchT<{
            id: number;
            title: string;
        }>(mockTodo1, {
            responseType: 'json',
            method: 'PUT',
            body: JSON.stringify({
                id: 100,
                title: 'happy-new',
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })).unwrap();

        assert(data.id === 100);
        assert(data.title === 'happy-new');
    });

    await t.step('Patch json', async () => {
        const data = (await fetchT<{
            title: string;
        }>(mockTodo1, {
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
            success: boolean;
        }>(mockTodo1, {
            responseType: 'json',
            method: 'DELETE',
        })).unwrap();

        assert(data.success);
    });

    await t.step('Get invalid json', async () => {
        const res = (await fetchT(mockInvalidJson, {
            responseType: 'json',
        }));

        assert((res.unwrapErr() as Error).message.includes(`Response is invalid json`));
    });

    await t.step('Abort fetch by default', async () => {
        const fetchTask = fetchT(mockTodo1, {
            abortable: true,
            timeout: 1000,
        });

        setTimeout(() => {
            fetchTask.abort();
        }, 0);

        const res = await fetchTask.response;
        assert((res.unwrapErr() as Error).name === ABORT_ERROR);
        assert(fetchTask.aborted);
    });

    await t.step('Abort fetch by custom', async () => {
        const fetchTask = fetchT(mockTodo1, {
            abortable: true,
            timeout: 1000,
        });

        const timer = setTimeout(() => {
            fetchTask.abort('cancel');
        }, 500);

        const res = await fetchTask.response;
        if (res.isErr()) {
            assert((res.unwrapErr() as string) === 'cancel');
        } else {
            clearTimeout(timer);
            assert(res.isOk());
            await res.unwrap().body?.cancel();
        }
    });

    await t.step('Invalid timeout', () => {
        assertThrows(() => fetchT(mockTodo1, {
            timeout: -1,
        }), Error);
    });

    await t.step('Abort fetch by timeout', async () => {
        const res = await fetchT(mockTodo1, {
            timeout: 1,
        });

        if (res.isErr()) {
            assert((res.unwrapErr() as Error).name === TIMEOUT_ERROR);
        } else {
            assert(res.isOk());
        }
    });

    await t.step('Fetch fail', async () => {
        const err: Error = (await fetchT(mockNotFound)).unwrapErr();
        assert(err.message.includes('404'));
    });
});