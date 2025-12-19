/**
 * Abortable request examples demonstrating cancellation and timeout.
 *
 * Run with: npx tsx examples/abortable.ts
 * Or with Deno: deno run --allow-net examples/abortable.ts
 */

import { fetchT, ABORT_ERROR, TIMEOUT_ERROR } from '../src/mod.ts';

const API_BASE = 'https://jsonplaceholder.typicode.com';

/**
 * Example 1: Manual abort
 */
async function manualAbort() {
    console.log('--- Example 1: Manual Abort ---');

    const task = fetchT(`${API_BASE}/posts`, {
        abortable: true,
        responseType: 'json',
    });

    // Abort after 10ms
    setTimeout(() => {
        console.log('Aborting request...');
        task.abort();
    }, 10);

    const result = await task.response;

    result
        .inspect((data) => {
            console.log('Got', (data as unknown[]).length, 'posts');
        })
        .inspectErr((err) => {
            if (err.name === ABORT_ERROR) {
                console.log('Request was aborted as expected');
            } else {
                console.error('Unexpected error:', err.message);
            }
        });

    console.log('Task aborted status:', task.aborted);
}

/**
 * Example 2: Abort with custom reason
 */
async function abortWithReason() {
    console.log('\n--- Example 2: Abort with Reason ---');

    const task = fetchT(`${API_BASE}/posts`, {
        abortable: true,
        responseType: 'json',
    });

    // Abort with a custom reason
    setTimeout(() => {
        task.abort(new Error('User cancelled the operation'));
    }, 10);

    const result = await task.response;

    result.inspectErr((err) => {
        console.log('Abort reason:', err.message);
    });
}

/**
 * Example 3: Timeout auto-abort
 */
async function timeoutAbort() {
    console.log('\n--- Example 3: Timeout Auto-Abort ---');

    // Use a very short timeout to trigger timeout error
    const result = await fetchT(`${API_BASE}/posts`, {
        timeout: 1, // 1ms timeout - will almost certainly timeout
        responseType: 'json',
    });

    result
        .inspect((data) => {
            console.log('Got', (data as unknown[]).length, 'posts (request was fast!)');
        })
        .inspectErr((err) => {
            if (err.name === TIMEOUT_ERROR) {
                console.log('Request timed out as expected');
            } else {
                console.log('Error:', err.name, '-', err.message);
            }
        });
}

/**
 * Example 4: Conditional abort based on response time
 */
async function conditionalAbort() {
    console.log('\n--- Example 4: Conditional Abort ---');

    const startTime = Date.now();
    const MAX_WAIT_TIME = 100; // 100ms max wait

    const task = fetchT(`${API_BASE}/posts`, {
        abortable: true,
        responseType: 'json',
    });

    // Check periodically and abort if taking too long
    const checkInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed > MAX_WAIT_TIME && !task.aborted) {
            console.log(`Request taking too long (${elapsed}ms), aborting...`);
            task.abort();
            clearInterval(checkInterval);
        }
    }, 10);

    const result = await task.response;
    clearInterval(checkInterval);

    const elapsed = Date.now() - startTime;

    result
        .inspect((data) => {
            console.log(`Got ${(data as unknown[]).length} posts in ${elapsed}ms`);
        })
        .inspectErr((err) => {
            console.log(`Request failed after ${elapsed}ms:`, err.name);
        });
}

/**
 * Example 5: Race multiple requests, abort losers
 */
async function raceRequests() {
    console.log('\n--- Example 5: Race Requests ---');

    // Create multiple requests to different endpoints
    const tasks = [
        { name: 'posts', task: fetchT(`${API_BASE}/posts`, { abortable: true, responseType: 'json' }) },
        { name: 'users', task: fetchT(`${API_BASE}/users`, { abortable: true, responseType: 'json' }) },
        { name: 'comments', task: fetchT(`${API_BASE}/comments`, { abortable: true, responseType: 'json' }) },
    ];

    // Race to see which completes first
    const winner = await Promise.race(
        tasks.map(async ({ name, task }) => {
            const result = await task.response;
            return { name, result, task };
        }),
    );

    // Abort all other requests
    for (const { name, task } of tasks) {
        if (name !== winner.name && !task.aborted) {
            task.abort();
            console.log(`Aborted loser: ${name}`);
        }
    }

    winner.result
        .inspect((data) => {
            console.log(`Winner: ${winner.name} with ${(data as unknown[]).length} items`);
        })
        .inspectErr((err) => {
            console.error('Winner failed:', err.message);
        });
}

/**
 * Example 6: Abortable with progress tracking
 */
async function abortableWithProgress() {
    console.log('\n--- Example 6: Abortable with Progress ---');

    const task = fetchT(`${API_BASE}/photos`, {
        abortable: true,
        responseType: 'json',
        onProgress: (progressResult) => {
            progressResult.inspect((progress) => {
                const percent = Math.round(
                    (progress.completedByteLength / progress.totalByteLength) * 100,
                );
                if (percent > 20 && !task.aborted) {
                    console.log(`Progress at ${percent}%, aborting...`);
                    task.abort();
                }
            });
        },
    });

    const result = await task.response;

    result
        .inspect(() => {
            console.log('Download completed');
        })
        .inspectErr((err) => {
            if (err.name === ABORT_ERROR) {
                console.log('Download aborted after 20% progress');
            } else {
                console.error('Error:', err.message);
            }
        });
}

// Run all examples
console.log('=== Abortable Request Examples ===\n');

await manualAbort();
await abortWithReason();
await timeoutAbort();
await conditionalAbort();
await raceRequests();
await abortableWithProgress();
