import { ServerResponse, ServerRequest } from "http";
import { File } from './File';
/**
 * @hidden
 */
interface Wrapper extends Function {
    res?: ServerResponse;
    req?: ServerRequest;
    url?: any;
    files?: File[];
    body?: { [name: string]: any };
    rawBody?: string;
    next?: Wrapper;
}

export {
    Wrapper
};
/**
 * @hidden
 */
export function getParent(): Wrapper {
    var caller = getParent.caller;
    while (caller && caller.name != "__wrapper") {
        caller = caller.caller;
    }
    if (!caller) {
        throw new Error(`Can't use Request.${getParent.caller} outside of a route`);
    }
    return caller;
}