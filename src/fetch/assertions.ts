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
 * assert url is a string
 *
 * @param url
 */
export function assertUrl(url: string): void {
    invariant(typeof url === 'string', () => `Url must be a string. Received ${ JSON.stringify(url) }`);
}