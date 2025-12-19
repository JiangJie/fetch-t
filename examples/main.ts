/**
 * Main entry point for running all examples.
 *
 * Run with: pnpm run eg
 */

console.log('╔════════════════════════════════════════╗');
console.log('║     @happy-ts/fetch-t Examples         ║');
console.log('╚════════════════════════════════════════╝\n');

await import('./basic.ts');
console.log();

await import('./with-progress.ts');
console.log();

await import('./abortable.ts');
console.log();

await import('./error-handling.ts');

console.log('\n╔════════════════════════════════════════╗');
console.log('║       All examples completed!          ║');
console.log('╚════════════════════════════════════════╝');
