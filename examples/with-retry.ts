/**
 * Retry examples demonstrating automatic retry strategies.
 *
 * Run with: npx tsx examples/with-retry.ts
 * Or with Deno: deno run --allow-net examples/with-retry.ts
 */

import { ABORT_ERROR, FetchError, fetchT, TIMEOUT_ERROR } from '../src/mod.ts';

const API_BASE = 'https://jsonplaceholder.typicode.com';

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

/**
 * Example 1: Basic retry - simple retry count
 */
async function basicRetry() {
    console.log('--- Example 1: Basic Retry ---');

    // Retry up to 3 times on network errors (default behavior)
    const result = await fetchT<Post>(`${API_BASE}/posts/1`, {
        retry: 3,
        responseType: 'json',
    });

    result
        .inspect((post) => {
            if (post == null) {
                console.log('No body');
                return;
            }
            console.log('Got post:', post.id, '-', post.title.substring(0, 30));
        })
        .inspectErr((err) => console.log('Error:', err.message));
}

/**
 * Example 2: Retry with static delay
 */
async function retryWithDelay() {
    console.log('\n--- Example 2: Retry with Static Delay ---');

    const result = await fetchT<Post>(`${API_BASE}/posts/2`, {
        retry: {
            retries: 3,
            delay: 1000, // Wait 1 second between retries
        },
        responseType: 'json',
    });

    result
        .inspect((post) => {
            if (post == null) {
                console.log('No body');
                return;
            }
            console.log('Got post:', post.id);
        })
        .inspectErr((err) => console.log('Error:', err.message));
}

/**
 * Example 3: Retry with exponential backoff
 */
async function retryWithExponentialBackoff() {
    console.log('\n--- Example 3: Exponential Backoff ---');

    const result = await fetchT<Post>(`${API_BASE}/posts/3`, {
        retry: {
            retries: 4,
            // Exponential backoff: 1s, 2s, 4s, 8s (capped at 10s)
            delay: (attempt) => {
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                console.log(`  Attempt ${attempt} will wait ${delay}ms before retry`);
                return delay;
            },
        },
        responseType: 'json',
    });

    result
        .inspect((post) => {
            if (post == null) {
                console.log('No body');
                return;
            }
            console.log('Got post:', post.id);
        })
        .inspectErr((err) => console.log('Error:', err.message));
}

/**
 * Example 4: Retry on specific HTTP status codes
 */
async function retryOnHttpStatusCodes() {
    console.log('\n--- Example 4: Retry on HTTP Status Codes ---');

    // Only retry on server errors (5xx)
    const result = await fetchT<Post>(`${API_BASE}/posts/4`, {
        retry: {
            retries: 3,
            delay: 500,
            when: [500, 502, 503, 504], // Server error status codes
        },
        responseType: 'json',
    });

    result
        .inspect((post) => {
            if (post == null) {
                console.log('No body');
                return;
            }
            console.log('Got post:', post.id);
        })
        .inspectErr((err) => {
            if (err instanceof FetchError) {
                console.log(`HTTP ${err.status}: ${err.message}`);
            } else {
                console.log('Error:', err.message);
            }
        });
}

/**
 * Example 5: Retry with custom condition function
 */
async function retryWithCustomCondition() {
    console.log('\n--- Example 5: Custom Retry Condition ---');

    const result = await fetchT<Post>(`${API_BASE}/posts/5`, {
        retry: {
            retries: 3,
            delay: 500,
            when: (error, attempt) => {
                // Never retry on user abort
                if (error.name === ABORT_ERROR) {
                    console.log(`  Attempt ${attempt}: Aborted, not retrying`);
                    return false;
                }
                // Always retry on timeout
                if (error.name === TIMEOUT_ERROR) {
                    console.log(`  Attempt ${attempt}: Timeout, will retry`);
                    return true;
                }
                // Retry on 5xx errors only
                if (error instanceof FetchError) {
                    const shouldRetry = error.status >= 500;
                    console.log(`  Attempt ${attempt}: HTTP ${error.status}, ${shouldRetry ? 'will' : 'won\'t'} retry`);
                    return shouldRetry;
                }
                // Retry on network errors
                console.log(`  Attempt ${attempt}: Network error, will retry`);
                return true;
            },
        },
        responseType: 'json',
    });

    result
        .inspect((post) => {
            if (post == null) {
                console.log('No body');
                return;
            }
            console.log('Got post:', post.id);
        })
        .inspectErr((err) => console.log('Final error:', err.message));
}

/**
 * Example 6: Retry with onRetry callback for logging/metrics
 */
async function retryWithCallback() {
    console.log('\n--- Example 6: Retry with Callback ---');

    const startTime = Date.now();

    const result = await fetchT<Post>(`${API_BASE}/posts/6`, {
        retry: {
            retries: 3,
            delay: 200,
            onRetry: (error, attempt) => {
                const elapsed = Date.now() - startTime;
                console.log(`  [${elapsed}ms] Retry #${attempt} triggered by: ${error.message}`);
            },
        },
        responseType: 'json',
    });

    const elapsed = Date.now() - startTime;
    result
        .inspect((post) => {
            if (post == null) {
                console.log(`[${elapsed}ms] No body`);
                return;
            }
            console.log(`[${elapsed}ms] Success! Got post:`, post.id);
        })
        .inspectErr((err) => console.log(`[${elapsed}ms] All retries failed:`, err.message));
}

/**
 * Example 7: Retry combined with timeout
 */
async function retryWithTimeout() {
    console.log('\n--- Example 7: Retry with Per-request Timeout ---');

    const result = await fetchT<Post>(`${API_BASE}/posts/7`, {
        timeout: 5000, // 5 second timeout per attempt
        retry: {
            retries: 2,
            delay: 1000,
            when: (error) => error.name === TIMEOUT_ERROR,
            onRetry: (_error, attempt) => {
                console.log(`  Request #${attempt} timed out, retrying...`);
            },
        },
        responseType: 'json',
    });

    result
        .inspect((post) => {
            if (post == null) {
                console.log('No body');
                return;
            }
            console.log('Got post:', post.id);
        })
        .inspectErr((err) => console.log('Error:', err.message));
}

/**
 * Example 8: Retry with abortable request
 */
async function retryWithAbortable() {
    console.log('\n--- Example 8: Abortable Retry ---');

    const task = fetchT<Post>(`${API_BASE}/posts/8`, {
        abortable: true,
        retry: {
            retries: 5,
            delay: 1000,
            onRetry: (_error, attempt) => {
                console.log(`  Retry attempt ${attempt}...`);
            },
        },
        responseType: 'json',
    });

    // Simulate user cancellation after 500ms
    // In real usage, this could be triggered by user action
    setTimeout(() => {
        if (!task.aborted) {
            // Don't abort for this demo since the API is fast
            // task.abort('User cancelled');
        }
    }, 500);

    const result = await task.response;
    result
        .inspect((post) => {
            if (post == null) {
                console.log('No body');
                return;
            }
            console.log('Got post:', post.id);
        })
        .inspectErr((err) => {
            if (err.name === ABORT_ERROR) {
                console.log('Request was cancelled by user');
            } else {
                console.log('Error:', err.message);
            }
        });
}

// Run all examples
console.log('=== Retry Examples ===\n');

await basicRetry();
await retryWithDelay();
await retryWithExponentialBackoff();
await retryOnHttpStatusCodes();
await retryWithCustomCondition();
await retryWithCallback();
await retryWithTimeout();
await retryWithAbortable();
