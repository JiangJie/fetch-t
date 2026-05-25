/**
 * @internal
 * Polyfills for AbortSignal and related APIs.
 */

import { TIMEOUT_ERROR } from './constants.ts';

/**
 * Creates an AbortSignal that aborts after the specified timeout.
 * Uses native `AbortSignal.timeout` when available, otherwise falls back to a manual implementation.
 */
export function signalTimeout(ms: number): AbortSignal {
    if (typeof AbortSignal.timeout === 'function') {
        return AbortSignal.timeout(ms);
    }

    // Polyfill for environments without AbortSignal.timeout (Node < 17.3)
    const controller = new AbortController();
    const timeoutError = createTimeoutError();

    const timerId = setTimeout(() => {
        controller.abort(timeoutError);
    }, ms);

    // Prevent the timer from keeping the Node.js event loop alive
    if (typeof timerId?.unref === 'function') {
        timerId.unref();
    }

    return controller.signal;
}

/**
 * Creates an AbortSignal that aborts when any of the provided signals abort.
 * Uses native `AbortSignal.any` when available, otherwise falls back to a manual implementation.
 *
 * The polyfill properly cleans up event listeners on all signals when one fires,
 * preventing memory leaks from long-lived signals.
 */
export function signalAny(signals: AbortSignal[]): AbortSignal {
    if (typeof AbortSignal.any === 'function') {
        return AbortSignal.any(signals);
    }

    // Polyfill for environments without AbortSignal.any (Node < 20.3)
    const controller = new AbortController();

    // Fast path: if any signal is already aborted, abort immediately
    for (const signal of signals) {
        if (signal.aborted) {
            controller.abort(signal.reason);
            return controller.signal;
        }
    }

    // Single shared handler — uses event.target to identify the source signal.
    // Note: cleanup is NOT called here explicitly. Instead, controller.abort() synchronously
    // dispatches the abort event on controller.signal, which triggers the cleanup listener below.
    // Chain: onAbort() → controller.abort() → controller.signal 'abort' event → cleanup()
    const onAbort = (event: Event): void => {
        const source = event.target as AbortSignal;
        controller.abort(source.reason);
    };

    // Remove listeners from all input signals to prevent memory leaks on long-lived signals
    const cleanup = (): void => {
        for (const signal of signals) {
            signal.removeEventListener('abort', onAbort);
        }
    };

    for (const signal of signals) {
        signal.addEventListener('abort', onAbort);
    }

    // Cleanup is driven by controller.signal's abort event, which fires synchronously
    // inside controller.abort(). This guarantees cleanup runs exactly once regardless
    // of which input signal triggered the abort.
    controller.signal.addEventListener('abort', cleanup);

    return controller.signal;
}

// #region Internal Functions

/**
 * Creates a DOMException with TimeoutError name.
 * Falls back to a plain Error in environments where DOMException constructor is unavailable.
 */
function createTimeoutError(): Error {
    const message = 'The operation timed out.';
    try {
        return new DOMException(message, TIMEOUT_ERROR);
    } catch {
        // Fallback for environments without DOMException constructor (e.g., old Web Workers)
        const error = new Error(message);
        error.name = TIMEOUT_ERROR;
        return error;
    }
}

// #endregion
