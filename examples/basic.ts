/**
 * Basic fetch examples demonstrating core functionality.
 *
 * Run with: npx tsx examples/basic.ts
 * Or with Deno: deno run --allow-net examples/basic.ts
 */

import { fetchT } from '../src/mod.ts';

const API_BASE = 'https://jsonplaceholder.typicode.com';

/**
 * Example 1: Simple GET request with JSON response
 */
async function fetchJson() {
    console.log('--- Example 1: GET JSON ---');

    const result = await fetchT(`${API_BASE}/posts/1`, {
        responseType: 'json',
    });

    result
        .inspect((data) => {
            console.log('Post title:', (data as { title: string; }).title);
        })
        .inspectErr((err) => {
            console.error('Failed:', err.message);
        });
}

/**
 * Example 2: GET request with text response
 */
async function fetchText() {
    console.log('\n--- Example 2: GET Text ---');

    const result = await fetchT(`${API_BASE}/posts/1`, {
        responseType: 'text',
    });

    result
        .inspect((text) => {
            console.log('Response length:', text.length, 'characters');
        })
        .inspectErr((err) => {
            console.error('Failed:', err.message);
        });
}

/**
 * Example 3: POST request with JSON body
 */
async function postJson() {
    console.log('\n--- Example 3: POST JSON ---');

    const result = await fetchT(`${API_BASE}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: 'Hello World',
            body: 'This is a test post',
            userId: 1,
        }),
        responseType: 'json',
    });

    result
        .inspect((data) => {
            console.log('Created post with id:', (data as { id: number; }).id);
        })
        .inspectErr((err) => {
            console.error('Failed:', err.message);
        });
}

/**
 * Example 4: GET request returning raw Response object
 */
async function fetchRawResponse() {
    console.log('\n--- Example 4: Raw Response ---');

    const result = await fetchT(`${API_BASE}/posts/1`);

    result
        .inspect((response) => {
            console.log('Status:', response.status);
            console.log('Content-Type:', response.headers.get('content-type'));
        })
        .inspectErr((err) => {
            console.error('Failed:', err.message);
        });
}

/**
 * Example 5: GET request with ArrayBuffer response
 */
async function fetchArrayBuffer() {
    console.log('\n--- Example 5: ArrayBuffer Response ---');

    const result = await fetchT(`${API_BASE}/posts/1`, {
        responseType: 'arraybuffer',
    });

    result
        .inspect((buffer) => {
            console.log('Buffer size:', buffer.byteLength, 'bytes');
        })
        .inspectErr((err) => {
            console.error('Failed:', err.message);
        });
}

/**
 * Example 6: GET request with Stream response
 */
async function fetchStream() {
    console.log('\n--- Example 6: Stream Response ---');

    const result = await fetchT(`${API_BASE}/posts/1`, {
        responseType: 'stream',
    });

    if (result.isOk()) {
        const stream = result.unwrap();
        const reader = stream.getReader();
        let totalBytes = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            totalBytes += value.byteLength;
        }

        console.log('Stream completed, total bytes:', totalBytes);
    } else {
        console.error('Failed:', result.unwrapErr().message);
    }
}

// Run all examples
console.log('=== Basic Fetch Examples ===\n');

await fetchJson();
await fetchText();
await postJson();
await fetchRawResponse();
await fetchArrayBuffer();
await fetchStream();
