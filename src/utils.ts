import { ServerResponse, ServerRequest } from "http";
import { File } from './File';
/**
 * @hidden
 */
interface Wrapper {
    res: ServerResponse;
    req: ServerRequest;
    url: any;
    files: File[];
    body: { [name: string]: any };
    rawBody: string;
    next();
}
/**
 * @hidden
 */
export function getParent(): Function & Wrapper {
    var caller = getParent.caller as any;
    while (caller && caller.name != "__wrapper") {
        caller = caller.caller;
    }
    if (!caller) {
        throw new Error(`Can't use Request.${getParent.caller} outside of a route`);
    }
    return caller as Function & Wrapper;
}