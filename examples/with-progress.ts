/**
 * Progress tracking examples demonstrating download monitoring.
 *
 * Run with: npx tsx examples/with-progress.ts
 * Or with Deno: deno run --allow-net examples/with-progress.ts
 */

import { fetchT } from '../src/mod.ts';

// A URL that returns a larger response for demonstrating progress
const LARGE_FILE_URL = 'https://jsonplaceholder.typicode.com/photos';

/**
 * Example 1: Basic progress tracking
 */
async function trackProgress() {
    console.log('--- Example 1: Basic Progress Tracking ---');

    const result = await fetchT(LARGE_FILE_URL, {
        responseType: 'json',
        onProgress: (progressResult) => {
            progressResult
                .inspect((progress) => {
                    const percent = Math.round(
                        (progress.completedByteLength / progress.totalByteLength) * 100,
                    );
                    console.log(`Progress: ${percent}% (${progress.completedByteLength}/${progress.totalByteLength} bytes)`);
                })
                .inspectErr((err) => {
                    // Content-Length header not available
                    console.log('Progress unavailable:', err.message);
                });
        },
    });

    result
        .inspect((data) => {
            if (data == null) {
                console.log('No body');
                return;
            }
            console.log('Downloaded', (data as unknown[]).length, 'photos');
        })
        .inspectErr((err) => {
            console.error('Failed:', err.message);
        });
}

/**
 * Example 2: Chunk-by-chunk processing
 */
async function processChunks() {
    console.log('\n--- Example 2: Chunk Processing ---');

    let chunkCount = 0;
    let totalBytes = 0;

    const result = await fetchT(LARGE_FILE_URL, {
        responseType: 'arraybuffer',
        onChunk: (chunk) => {
            chunkCount++;
            totalBytes += chunk.byteLength;
            console.log(`Chunk ${chunkCount}: ${chunk.byteLength} bytes`);
        },
    });

    result
        .inspect(() => {
            console.log(`Total: ${chunkCount} chunks, ${totalBytes} bytes`);
        })
        .inspectErr((err) => {
            console.error('Failed:', err.message);
        });
}

/**
 * Example 3: Combined progress and chunk tracking
 */
async function combinedTracking() {
    console.log('\n--- Example 3: Combined Progress + Chunks ---');

    let lastPercent = 0;

    const result = await fetchT(LARGE_FILE_URL, {
        responseType: 'blob',
        onProgress: (progressResult) => {
            progressResult.inspect((progress) => {
                const percent = Math.round(
                    (progress.completedByteLength / progress.totalByteLength) * 100,
                );
                // Only log on 10% increments
                if (percent >= lastPercent + 10) {
                    lastPercent = percent;
                    console.log(`Downloaded: ${percent}%`);
                }
            });
        },
        onChunk: (chunk) => {
            // Process each chunk as it arrives
            // (e.g., calculate hash, write to disk, etc.)
            void chunk; // Acknowledge receipt
        },
    });

    result
        .inspect((blob) => {
            console.log('Download complete! Blob size:', blob.size, 'bytes');
        })
        .inspectErr((err) => {
            console.error('Failed:', err.message);
        });
}

/**
 * Example 4: Progress with custom progress bar
 */
async function progressBar() {
    console.log('\n--- Example 4: Progress Bar ---');

    const BAR_LENGTH = 40;

    const result = await fetchT(LARGE_FILE_URL, {
        responseType: 'text',
        onProgress: (progressResult) => {
            progressResult.inspect((progress) => {
                const ratio = progress.completedByteLength / progress.totalByteLength;
                const filled = Math.round(BAR_LENGTH * ratio);
                const empty = BAR_LENGTH - filled;
                const bar = '█'.repeat(filled) + '░'.repeat(empty);
                const percent = Math.round(ratio * 100);
                console.log(`[${bar}] ${percent}%`);
            });
        },
    });

    result
        .inspect((text) => {
            console.log('Downloaded', text.length, 'characters');
        })
        .inspectErr((err) => {
            console.error('Failed:', err.message);
        });
}

// Run all examples
console.log('=== Progress Tracking Examples ===\n');

await trackProgress();
await processChunks();
await combinedTracking();
await progressBar();
