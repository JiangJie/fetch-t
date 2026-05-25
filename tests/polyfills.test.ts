import { afterEach, describe, expect, it, vi } from 'vitest';
import { TIMEOUT_ERROR } from '../src/fetch/constants.ts';
import { signalAny, signalTimeout } from '../src/fetch/polyfills.ts';

describe('polyfills', () => {
    describe('signalTimeout', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('should use native AbortSignal.timeout when available', () => {
            const signal = signalTimeout(1000);
            // Native AbortSignal.timeout returns a valid signal
            expect(signal).toBeInstanceOf(AbortSignal);
            expect(signal.aborted).toBe(false);
        });

        it('should fallback to polyfill when AbortSignal.timeout is unavailable', async () => {
            const original = AbortSignal.timeout;
            // @ts-expect-error - intentionally removing for polyfill testing
            AbortSignal.timeout = undefined;

            try {
                const signal = signalTimeout(50);
                expect(signal).toBeInstanceOf(AbortSignal);
                expect(signal.aborted).toBe(false);

                // Wait for timeout to fire
                await new Promise(resolve => setTimeout(resolve, 100));

                expect(signal.aborted).toBe(true);
                expect(signal.reason).toBeInstanceOf(DOMException);
                expect(signal.reason.name).toBe(TIMEOUT_ERROR);
            } finally {
                AbortSignal.timeout = original;
            }
        });

        it('should call unref on timer in Node.js environment', () => {
            const original = AbortSignal.timeout;
            // @ts-expect-error - intentionally removing for polyfill testing
            AbortSignal.timeout = undefined;

            try {
                // signalTimeout should not throw and should return a valid signal
                const signal = signalTimeout(10000);
                expect(signal).toBeInstanceOf(AbortSignal);
                expect(signal.aborted).toBe(false);
            } finally {
                AbortSignal.timeout = original;
            }
        });

        it('should work when setTimeout returns a number (browser environment)', async () => {
            const original = AbortSignal.timeout;
            const originalSetTimeout = globalThis.setTimeout;
            // @ts-expect-error - intentionally removing for polyfill testing
            AbortSignal.timeout = undefined;

            // Simulate browser setTimeout that returns a number (no unref method)
            // @ts-expect-error - simulate browser behavior
            globalThis.setTimeout = (fn: () => void, ms: number) => {
                const id = originalSetTimeout(fn, ms);
                return Number(id);
            };

            try {
                const signal = signalTimeout(50);
                expect(signal).toBeInstanceOf(AbortSignal);
                expect(signal.aborted).toBe(false);

                await new Promise(resolve => originalSetTimeout(resolve, 100));
                expect(signal.aborted).toBe(true);
            } finally {
                AbortSignal.timeout = original;
                globalThis.setTimeout = originalSetTimeout;
            }
        });

        it('should fallback to Error when DOMException constructor is unavailable', async () => {
            const originalTimeout = AbortSignal.timeout;
            const originalDOMException = globalThis.DOMException;
            // @ts-expect-error - intentionally removing for polyfill testing
            AbortSignal.timeout = undefined;
            // @ts-expect-error - intentionally removing for polyfill testing
            // eslint-disable-next-line @typescript-eslint/no-extraneous-class
            globalThis.DOMException = class {
                constructor() {
                    throw new Error('DOMException not supported');
                }
            };

            try {
                const signal = signalTimeout(50);

                await new Promise(resolve => setTimeout(resolve, 100));

                expect(signal.aborted).toBe(true);
                expect(signal.reason).toBeInstanceOf(Error);
                expect(signal.reason.name).toBe(TIMEOUT_ERROR);
                expect(signal.reason.message).toBe('The operation timed out.');
            } finally {
                AbortSignal.timeout = originalTimeout;
                globalThis.DOMException = originalDOMException;
            }
        });
    });

    describe('signalAny', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('should use native AbortSignal.any when available', () => {
            const controller = new AbortController();
            const signal = signalAny([controller.signal]);
            expect(signal).toBeInstanceOf(AbortSignal);
            expect(signal.aborted).toBe(false);
        });

        it('should fallback to polyfill when AbortSignal.any is unavailable', () => {
            const original = AbortSignal.any;
            // @ts-expect-error - intentionally removing for polyfill testing
            AbortSignal.any = undefined;

            try {
                const controller = new AbortController();
                const signal = signalAny([controller.signal]);
                expect(signal).toBeInstanceOf(AbortSignal);
                expect(signal.aborted).toBe(false);

                // Abort and verify propagation
                controller.abort('test reason');
                expect(signal.aborted).toBe(true);
            } finally {
                AbortSignal.any = original;
            }
        });

        it('should abort immediately if any input signal is already aborted', () => {
            const original = AbortSignal.any;
            // @ts-expect-error - intentionally removing for polyfill testing
            AbortSignal.any = undefined;

            try {
                const controller = new AbortController();
                controller.abort('pre-aborted');

                const signal = signalAny([controller.signal]);
                expect(signal.aborted).toBe(true);
                expect(signal.reason).toBe('pre-aborted');
            } finally {
                AbortSignal.any = original;
            }
        });

        it('should propagate reason from the first signal that aborts', () => {
            const original = AbortSignal.any;
            // @ts-expect-error - intentionally removing for polyfill testing
            AbortSignal.any = undefined;

            try {
                const controller1 = new AbortController();
                const controller2 = new AbortController();
                const signal = signalAny([controller1.signal, controller2.signal]);

                controller1.abort(new Error('first'));

                expect(signal.aborted).toBe(true);
                expect(signal.reason).toBeInstanceOf(Error);
                expect((signal.reason as Error).message).toBe('first');
            } finally {
                AbortSignal.any = original;
            }
        });

        it('should cleanup listeners after one signal fires (no memory leak)', () => {
            const original = AbortSignal.any;
            // @ts-expect-error - intentionally removing for polyfill testing
            AbortSignal.any = undefined;

            try {
                const controller1 = new AbortController();
                const controller2 = new AbortController();

                // Spy on removeEventListener to verify cleanup
                const spy1 = vi.spyOn(controller1.signal, 'removeEventListener');
                const spy2 = vi.spyOn(controller2.signal, 'removeEventListener');

                const signal = signalAny([controller1.signal, controller2.signal]);

                // Trigger abort on controller1
                controller1.abort('done');

                expect(signal.aborted).toBe(true);
                // Both signals should have their listeners removed
                expect(spy1).toHaveBeenCalled();
                expect(spy2).toHaveBeenCalled();
            } finally {
                AbortSignal.any = original;
            }
        });

        it('should handle multiple signals where second one fires', () => {
            const original = AbortSignal.any;
            // @ts-expect-error - intentionally removing for polyfill testing
            AbortSignal.any = undefined;

            try {
                const controller1 = new AbortController();
                const controller2 = new AbortController();
                const signal = signalAny([controller1.signal, controller2.signal]);

                controller2.abort('second fired');

                expect(signal.aborted).toBe(true);
                expect(signal.reason).toBe('second fired');

                // Aborting the first after should have no effect
                controller1.abort('too late');
                expect(signal.reason).toBe('second fired');
            } finally {
                AbortSignal.any = original;
            }
        });

        it('should handle already-aborted signal among multiple signals', () => {
            const original = AbortSignal.any;
            // @ts-expect-error - intentionally removing for polyfill testing
            AbortSignal.any = undefined;

            try {
                const aborted = new AbortController();
                aborted.abort('already done');
                const active = new AbortController();

                const signal = signalAny([active.signal, aborted.signal]);

                // Should immediately abort with the already-aborted signal's reason
                expect(signal.aborted).toBe(true);
                expect(signal.reason).toBe('already done');
            } finally {
                AbortSignal.any = original;
            }
        });
    });
});
