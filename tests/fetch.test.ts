import { describe, expect, test } from '@jest/globals';
import { fetchT } from '../src/mod.ts';

describe('fetch', () => {
    test('invalid url will throw', async () => {
        const url = null;
        expect(fetchT.bind(null, url!)).toThrowError(TypeError);
    });

    test('get Response by default', async () => {
        const data = (await fetchT('https://jsonplaceholder.typicode.com/posts/1')).unwrap();

        expect(data.url).toBe('https://jsonplaceholder.typicode.com/posts/1');
    });

    test('get Response by RequestInit', async () => {
        const data = (await fetchT('https://jsonplaceholder.typicode.com/posts/1', {
            mode: 'no-cors',
        } as RequestInit)).unwrap();

        expect(data.url).toBe('https://jsonplaceholder.typicode.com/posts/1');
    });

    test('get text by response type', async () => {
        const data = (await fetchT('https://jsonplaceholder.typicode.com/posts/1', {
            responseType: 'text',
        })).unwrap();

        expect(data.includes(`"userId": 1`)).toBe(true);
    });

    test('get arraybuffer by response type', async () => {
        const data = (await fetchT('https://jsonplaceholder.typicode.com/posts/1', {
            responseType: 'arraybuffer',
        })).unwrap();

        expect(data.byteLength).toBe(292);
    });

    test('get blob by response type', async () => {
        const data = (await fetchT('https://jsonplaceholder.typicode.com/posts/1', {
            responseType: 'blob',
        })).unwrap();

        expect(data.size).toBe(292);
    });

    test('get json by response type', async () => {
        const data = (await fetchT<{ userId: number }[]>('https://jsonplaceholder.typicode.com/posts', {
            responseType: 'json',
            method: 'GET',
        })).unwrap();

        expect(data.length).toBe(100);
        expect(data[0].userId).toBe(1);
    });

    test('post json', async () => {
        const data = (await fetchT<{
            id: number;
        }>('https://jsonplaceholder.typicode.com/posts', {
            responseType: 'json',
            method: 'POST',
            body: JSON.stringify({
                title: 'foo',
                body: 'bar',
                userId: 1,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })).unwrap();

        expect(data.id).toBe(101);
    });

    test('put json', async () => {
        const data = (await fetchT<{
            title: string;
        }>('https://jsonplaceholder.typicode.com/posts/1', {
            responseType: 'json',
            method: 'PUT',
            body: JSON.stringify({
                id: 1,
                title: 'foo',
                body: 'bar',
                userId: 1,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })).unwrap();

        expect(data.title).toBe('foo');
    });

    test('patch json', async () => {
        const data = (await fetchT<{
            title: string;
        }>('https://jsonplaceholder.typicode.com/posts/1', {
            responseType: 'json',
            method: 'PATCH',
            body: JSON.stringify({
                title: 'foo',
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })).unwrap();

        expect(data.title).toBe('foo');
    });

    test('delete json', async () => {
        const data = (await fetchT('https://jsonplaceholder.typicode.com/posts/1', {
            responseType: 'text',
            method: 'DELETE',
        })).unwrap();

        expect(data).toBe(`{}`);
    });

    test('get invalid json', async () => {
        const res = (await fetchT('https://jsonplaceholder.typicode.com/', {
            responseType: 'json',
        }));

        expect((res.err() as Error).message.includes(`Response is invalid json`)).toBe(true);
    });

    test('abort fetch by default', async () => {
        const fetchTask = fetchT('https://jsonplaceholder.typicode.com/posts/1', {
            abortable: true,
        });

        setTimeout(() => {
            fetchTask.abort();
        }, 0);

        const res = await fetchTask.response;
        expect((res.err() as Error).name).toBe('AbortError');
        expect(fetchTask.aborted).toBe(true);
    });

    test('abort fetch by custom', async () => {
        const fetchTask = fetchT('https://jsonplaceholder.typicode.com/posts/1', {
            abortable: true,
        });

        setTimeout(() => {
            fetchTask.abort('cancel');
        }, 500);

        const res = await fetchTask.response;
        if (res.isErr()) {
            expect(res.err()).toBe('cancel');
        } else {
            expect(res.isOk()).toBe(true);
        }
    });
});