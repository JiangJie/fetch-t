/**
 * assert function
 * @param expr
 * @param createMsg return a string message to throw
 */
function invariant(expr: unknown, createMsg: () => string): void {
    if (!expr) {
        throw new TypeError(createMsg());
    }
}

/**
 * assert url is an URL object
 *
 * @param url
 */
export function assertURL(url: URL): void {
    invariant(url instanceof URL, () => `Url must be an URL object. Received ${ JSON.stringify(url) }`);
}