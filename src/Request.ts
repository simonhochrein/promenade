import * as querystring from 'querystring';
// import { getParent } from './utils';
import { File } from './File';
import { trace } from './Wrapper';

export default class Request {
    /**
     * Returns query parameters of current route
     * 
     * ### Example:
     * ```typescript
     * console.log(Request.Query.search)
     * ```
     *
     * @memberof Request
     */
    static get Query() {
        return querystring.parse(trace().url.query);
    }

    /**
     * Returns body of current route
     * 
     * ### Example:
     * ```typescript
     * console.log(Request.Body.name)
     * ```
     *
     * @memberof Request
     */
    static get Body(): { [name: string]: any } {
        return trace().body || {};
    }

    /**
     * Returns files of current route
     * 
     * ### Example:
     * ```typescript
     * console.log(Request.Files[0].FileName)
     * ```
     *
     * @memberof Request
     */
    static get Files(): File[] {
        return trace().files || [];
    }
    /**
     * Returns HTTP method of current route
     * 
     * ### Example:
     * ```typescript
     * console.log(Request.Method)
     * ```
     *
     * @memberof Request
     */
    static get Method(): any {
        return trace().req.method;
    }
    /**
     * Returns URL of current route
     * 
     * ### Example:
     * ```typescript
     * console.log(Request.Url)
     * ```
     *
     * @memberof Request
     */
    static get Url(): string {
        return trace().url.pathname;
    }
    /**
     * Returns raw body of current route
     * 
     * ### Example:
     * ```typescript
     * console.log(Request.RawBody)
     * ```
     *
     * @memberof Request
     */
    static get RawBody() {
        return trace().rawBody || "";
    }
}