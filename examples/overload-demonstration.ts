import { fetchT, type FetchInit, type FetchResponseType } from '../src/mod.ts';

/**
 * This file demonstrates how different arguments to fetchT match specific function overloads.
 * Each variable is explicitly typed to prove the return type of the matched overload.
 */

async function main() {
    const url = 'https://api.example.com/data';

    // =========================================================================
    // 1. Literal responseType (non-abortable)
    // Matches: abortable?: false; responseType: 'text' | 'json' | ...
    // =========================================================================

    // Returns FetchResponse<string, Error>
    const resText = fetchT(url, {
        responseType: 'text',
    });
    console.log(resText);

    // Returns FetchResponse<T | null, Error>
    const resJson = fetchT<{ id: number; }>(url, {
        responseType: 'json',
    });
    console.log(resJson);

    // Returns FetchResponse<ArrayBuffer, Error>
    const resBuffer = fetchT(url, {
        responseType: 'arraybuffer',
    });
    console.log(resBuffer);

    // Returns FetchResponse<Blob, Error>
    const resBlob = fetchT(url, {
        responseType: 'blob',
    });
    console.log(resBlob);

    // Returns FetchResponse<ReadableStream<Uint8Array<ArrayBuffer>> | null, Error>
    const resStream = fetchT(url, {
        responseType: 'stream',
    });
    console.log(resStream);

    // Returns FetchResponse<Uint8Array<ArrayBuffer>, Error>
    const resBytes = fetchT(url, {
        responseType: 'bytes',
    });
    console.log(resBytes);


    // =========================================================================
    // 2. Literal responseType (abortable: true)
    // Matches: abortable: true; responseType: 'text' | 'json' | ...
    // =========================================================================

    // Returns FetchTask<string>
    const taskText = fetchT(url, {
        abortable: true,
        responseType: 'text',
    });
    console.log(taskText);

    // Returns FetchTask<T | null>
    const taskJson = fetchT<{ id: number; }>(url, {
        abortable: true,
        responseType: 'json',
    });
    console.log(taskJson);

    // Returns FetchTask<ArrayBuffer>
    const taskBuffer = fetchT(url, {
        abortable: true,
        responseType: 'arraybuffer',
    });
    console.log(taskBuffer);

    // Returns FetchTask<Blob>
    const taskBlob = fetchT(url, {
        abortable: true,
        responseType: 'blob',
    });
    console.log(taskBlob);

    // Returns FetchTask<ReadableStream<Uint8Array<ArrayBuffer>> | null>
    const taskStream = fetchT(url, {
        abortable: true,
        responseType: 'stream',
    });
    console.log(taskStream);

    // Returns FetchTask<Uint8Array<ArrayBuffer>>
    const taskBytes = fetchT(url, {
        abortable: true,
        responseType: 'bytes',
    });
    console.log(taskBytes);


    // =========================================================================
    // 3. Union responseType (FetchResponseType)
    // Matches: responseType: FetchResponseType
    // =========================================================================

    const rt: FetchResponseType = 'json' as FetchResponseType;

    // Matches non-abortable union overload -> FetchResponse<FetchResponseData, Error>
    const resUnion = fetchT(url, {
        responseType: rt,
    });
    console.log(resUnion);

    // Matches abortable union overload -> FetchTask<FetchResponseData>
    const taskUnion = fetchT(url, {
        abortable: true,
        responseType: rt,
    });
    console.log(taskUnion);


    // =========================================================================
    // 4. Fallback / No responseType
    // Matches: abortable: true (no responseType) OR the generic fallback
    // =========================================================================

    // Matches abortable generic overload -> FetchTask<Response>
    const taskGeneric = fetchT(url, {
        abortable: true,
    });
    console.log(taskGeneric);

    // Matches final fallback overload -> FetchResponse<Response>
    const resDefault = fetchT(url);
    console.log(resDefault);

    const resWithInit = fetchT(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    console.log(resWithInit);


    // =========================================================================
    // 5. Invalid values (Type errors)
    // These should not match any overload and cause compile-time errors.
    // =========================================================================

    // @ts-expect-error - 'invalid' is not a FetchResponseType
    fetchT(url, { responseType: 'invalid' });

    const dynamicRt = 'text' as string;
    // @ts-expect-error - plain string is no longer accepted directly
    fetchT(url, { responseType: dynamicRt });


    // =========================================================================
    // 6. FetchInit variable (fallback overload)
    // Matches: fetchT(url, init: FetchInit) -> FetchTask | FetchResult
    // =========================================================================

    // When passing FetchInit as a variable, TypeScript cannot determine abortable's literal value
    // Falls back to union return type: FetchTask<FetchResponseData> | FetchResult<FetchResponseData>
    let options: FetchInit | undefined;
    const resOrTask = fetchT(url, options);
    console.log(resOrTask);

    console.log('All overloads demonstrated successfully!');
}

main();
