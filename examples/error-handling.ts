/**
 * Error handling examples demonstrating various error scenarios.
 *
 * Run with: npx tsx examples/error-handling.ts
 * Or with Deno: deno run --allow-net examples/error-handling.ts
 */

import { ABORT_ERROR, FetchError, fetchT, TIMEOUT_ERROR } from '../src/mod.ts';

const API_BASE = 'https://jsonplaceholder.typicode.com';

/**
 * Example 1: Handle HTTP errors (4xx, 5xx)
 */
async function handleHttpErrors() {
    console.log('--- Example 1: HTTP Errors ---');

    // Request a non-existent resource (404)
    const result = await fetchT(`${API_BASE}/posts/99999`, {
        responseType: 'json',
    });

    result
        .inspect((data) => {
            console.log('Got data:', data);
        })
        .inspectErr((err) => {
            if (err instanceof FetchError) {
                console.log(`HTTP Error: ${err.status} - ${err.message}`);
            } else {
                console.log('Other error:', err.message);
            }
        });
}

/**
 * Example 2: Handle network errors
 */
async function handleNetworkErrors() {
    console.log('\n--- Example 2: Network Errors ---');

    // Request to invalid host
    const result = await fetchT('https://this-domain-does-not-exist-12345.com/api', {
        responseType: 'json',
        timeout: 5000, // 5 second timeout to avoid hanging
    });

    result
        .inspect(() => {
            console.log('Request succeeded (unexpected)');
        })
        .inspectErr((err) => {
            if (err.name === TIMEOUT_ERROR) {
                console.log('Request timed out');
            } else {
                console.log('Network error:', err.message);
            }
        });
}

/**
 * Example 3: Handle invalid JSON response
 */
async function handleInvalidJson() {
    console.log('\n--- Example 3: Invalid JSON ---');

    // Request HTML page but expect JSON
    const result = await fetchT('https://example.com', {
        responseType: 'json',
    });

    result
        .inspect((data) => {
            console.log('Got data:', data);
        })
        .inspectErr((err) => {
            console.log('JSON parse error:', err.message);
        });
}

/**
 * Example 4: Comprehensive error handling with type guards
 */
async function comprehensiveErrorHandling() {
    console.log('\n--- Example 4: Comprehensive Error Handling ---');

    async function safeFetch(url: string) {
        const result = await fetchT(url, {
            responseType: 'json',
            timeout: 10000,
        });

        if (result.isOk()) {
            const data = result.unwrap();
            if (data == null) {
                return { success: false as const, errorType: 'no_body', message: 'Response has no body' };
            }
            return { success: true as const, data };
        }

        const err = result.unwrapErr();
        // Categorize the error
        if (err.name === ABORT_ERROR) {
            return { success: false as const, errorType: 'abort', message: 'Request was cancelled' };
        }
        if (err.name === TIMEOUT_ERROR) {
            return { success: false as const, errorType: 'timeout', message: 'Request timed out' };
        }
        if (err instanceof FetchError) {
            return { success: false as const, errorType: 'http', status: err.status, message: err.message };
        }
        return { success: false as const, errorType: 'unknown', message: err.message };
    }

    // Test with valid URL
    const result1 = await safeFetch(`${API_BASE}/posts/1`);
    if (result1.success) {
        console.log('Valid URL - Got post:', (result1.data as { id: number; }).id);
    } else {
        console.log('Valid URL - Error:', result1.message);
    }

    // Test with invalid URL (404)
    const result2 = await safeFetch(`${API_BASE}/posts/99999`);
    if (result2.success) {
        console.log('Invalid URL - Got data (unexpected)');
    } else {
        console.log(`Invalid URL - ${result2.errorType} error:`, result2.message);
    }
}

/**
 * Example 5: Manual retry on failure (before built-in retry feature)
 */
async function manualRetryOnFailure() {
    console.log('\n--- Example 5: Manual Retry on Failure ---');

    async function fetchWithRetry(
        url: string,
        maxRetries = 3,
        delayMs = 1000,
    ): Promise<unknown> {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            console.log(`Attempt ${attempt}/${maxRetries}...`);

            const result = await fetchT(url, {
                responseType: 'json',
                timeout: 5000,
            });

            if (result.isOk()) {
                return result.unwrap();
            }

            const err = result.unwrapErr();
            // Check if error is retryable
            const isRetryable =
                err.name === TIMEOUT_ERROR ||
                (err instanceof FetchError && err.status >= 500);

            if (!isRetryable) {
                throw err;
            }

            if (attempt < maxRetries) {
                console.log(`Retrying in ${delayMs}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        }

        throw new Error(`Failed after ${maxRetries} attempts`);
    }

    try {
        const data = await fetchWithRetry(`${API_BASE}/posts/1`);
        console.log('Success! Got post:', (data as { id: number; }).id);
    } catch (err) {
        console.error('All retries failed:', (err as Error).message);
    }
}

/**
 * Example 6: Built-in retry feature
 * Demonstrates the retry option with retries, delay, when, and onRetry properties.
 */
async function builtInRetry() {
    console.log('\n--- Example 6: Built-in Retry Feature ---');

    interface Post {
        id: number;
        title: string;
    }

    // Basic retry - retries on network errors by default
    console.log('\n6a. Basic retry (network errors only):');
    const result1 = await fetchT<Post>(`${API_BASE}/posts/1`, {
        retry: 3,
        responseType: 'json',
    });
    result1
        .inspect((post) => {
            if (post == null) {
                console.log('  No body');
                return;
            }
            console.log('  Got post:', post.id);
        })
        .inspectErr((err) => console.log('  Error:', err.message));

    // Retry with static delay
    console.log('\n6b. Retry with 500ms delay:');
    const result2 = await fetchT<Post>(`${API_BASE}/posts/2`, {
        retry: {
            retries: 2,
            delay: 500,
        },
        responseType: 'json',
    });
    result2
        .inspect((post) => {
            if (post == null) {
                console.log('  No body');
                return;
            }
            console.log('  Got post:', post.id);
        })
        .inspectErr((err) => console.log('  Error:', err.message));

    // Retry with exponential backoff
    console.log('\n6c. Retry with exponential backoff:');
    const result3 = await fetchT<Post>(`${API_BASE}/posts/3`, {
        retry: {
            retries: 3,
            delay: (attempt) => {
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                console.log(`  Backoff delay for attempt ${attempt}: ${delay}ms`);
                return delay;
            },
        },
        responseType: 'json',
    });
    result3
        .inspect((post) => {
            if (post == null) {
                console.log('  No body');
                return;
            }
            console.log('  Got post:', post.id);
        })
        .inspectErr((err) => console.log('  Error:', err.message));

    // Retry on specific HTTP status codes
    console.log('\n6d. Retry on specific HTTP status codes (500, 502, 503, 504):');
    const result4 = await fetchT<Post>(`${API_BASE}/posts/4`, {
        retry: {
            retries: 3,
            when: [500, 502, 503, 504],
        },
        responseType: 'json',
    });
    result4
        .inspect((post) => {
            if (post == null) {
                console.log('  No body');
                return;
            }
            console.log('  Got post:', post.id);
        })
        .inspectErr((err) => console.log('  Error:', err.message));

    // Retry with custom condition
    console.log('\n6e. Retry with custom condition:');
    const result5 = await fetchT<Post>(`${API_BASE}/posts/5`, {
        retry: {
            retries: 3,
            when: (error, attempt) => {
                console.log(`  Checking retry condition for attempt ${attempt}`);
                // Retry on network errors or 5xx status codes
                if (error instanceof FetchError) {
                    return error.status >= 500;
                }
                // Retry on all non-abort errors
                return error.name !== ABORT_ERROR;
            },
        },
        responseType: 'json',
    });
    result5
        .inspect((post) => {
            if (post == null) {
                console.log('  No body');
                return;
            }
            console.log('  Got post:', post.id);
        })
        .inspectErr((err) => console.log('  Error:', err.message));

    // Retry with onRetry callback for logging
    console.log('\n6f. Retry with onRetry callback:');
    const result6 = await fetchT<Post>(`${API_BASE}/posts/6`, {
        retry: {
            retries: 3,
            delay: 100,
            onRetry: (error, attempt) => {
                console.log(`  [onRetry] Attempt ${attempt} starting after error: ${error.message}`);
            },
        },
        responseType: 'json',
    });
    result6
        .inspect((post) => {
            if (post == null) {
                console.log('  No body');
                return;
            }
            console.log('  Got post:', post.id);
        })
        .inspectErr((err) => console.log('  Error:', err.message));

    // Retry with timeout per attempt
    console.log('\n6g. Retry with per-attempt timeout:');
    const result7 = await fetchT<Post>(`${API_BASE}/posts/7`, {
        retry: {
            retries: 2,
            when: (error) => error.name === TIMEOUT_ERROR,
            onRetry: (_error, attempt) => console.log(`  Retrying after timeout, attempt ${attempt}`),
        },
        timeout: 5000, // 5 seconds per attempt
        responseType: 'json',
    });
    result7
        .inspect((post) => {
            if (post == null) {
                console.log('  No body');
                return;
            }
            console.log('  Got post:', post.id);
        })
        .inspectErr((err) => console.log('  Error:', err.message));
}

/**
 * Example 7: Using Result methods for chaining
 */
async function resultChaining() {
    console.log('\n--- Example 6: Result Chaining ---');

    interface Post {
        id: number;
        title: string;
        body: string;
        userId: number;
    }

    const result = await fetchT<Post>(`${API_BASE}/posts/1`, {
        responseType: 'json',
    });

    // Chain operations on the result
    const processed = result
        .map((post) => {
            if (post == null) {
                throw new Error('Response has no body');
            }
            return {
                id: post.id,
                title: post.title.toUpperCase(),
                preview: `${ post.body.substring(0, 50) }...`,
            };
        })
        .mapErr((err) => new Error(`Failed to fetch post: ${err.message}`));

    processed
        .inspect((data) => {
            console.log('Processed post:');
            console.log('  ID:', data.id);
            console.log('  Title:', data.title);
            console.log('  Preview:', data.preview);
        })
        .inspectErr((err) => {
            console.error(err.message);
        });
}

/**
 * Example 8: Unwrap with default value
 */
async function unwrapWithDefault() {
    console.log('\n--- Example 7: Unwrap with Default ---');

    interface Post {
        id: number;
        title: string;
    }

    const defaultPost: Post = {
        id: 0,
        title: 'Default Post',
    };

    // Try to fetch a non-existent post
    const result = await fetchT<Post>(`${API_BASE}/posts/99999`, {
        responseType: 'json',
    });

    // Use unwrapOr to get a default value on error
    const post = result.unwrapOr(defaultPost) ?? defaultPost;
    console.log('Post title:', post.title);

    // Or use unwrapOrElse for lazy evaluation
    const post2 = result.unwrapOrElse((err) => {
        console.log('Using default because:', err.message);
        return defaultPost;
    }) ?? defaultPost;
    console.log('Post2 title:', post2.title);
}

// Run all examples
console.log('=== Error Handling Examples ===\n');

await handleHttpErrors();
await handleNetworkErrors();
await handleInvalidJson();
await comprehensiveErrorHandling();
await manualRetryOnFailure();
await builtInRetry();
await resultChaining();
await unwrapWithDefault();
