import { getParent } from "./utils";
import * as zlib from 'zlib';
import App from "./App";

export default class Response {
    /**
     * Send response to user
     * 
     * ### Example:
     * ```typescript
     * Response.Send("Hello World!")
     * ```
     * 
     * @static
     * @param {*} value 
     * @memberof Response
     */
    static Send(value: any) {
        let parent = getParent();
        if (typeof value == "object") {
            if (App.get('gzip') == true) {
                parent.res.setHeader("Content-Encoding", "gzip");
                var zip = zlib.createGzip();
                zip.pipe(parent.res);
                zip.write(JSON.stringify(value));
                zip.end();
            } else {
                parent.res.write(JSON.stringify(value));
                parent.res.end();
            }
        } else {
            if (App.get('gzip') == true) {
                parent.res.setHeader("Content-Encoding", "gzip");
                var zip = zlib.createGzip();
                zip.pipe(parent.res);
                zip.write(value.toString());
                zip.end();
            } else {
                parent.res.write(value.toString());
                parent.res.end();
            }
        }
    }
    /**
     * Sets response header
     * 
     * ### Example:
     * ```typescript
     * Response.Header("Location", "/")
     * ```
     * 
     * @static
     * @param {string} key 
     * @param {string} value 
     * @memberof Response
     */
    static Header(key: string, value: string) {
        let parent = getParent();
        if (parent) {
            parent.res.setHeader(key, value);
        } else {
            throw new Error("Can't call Response.Write outside of a route");
        }
    }
    /**
     * Sets the status code of the response
     * 
     * ### Example:
     * ```typescript
     * Response.Status(402)
     * ```
     * 
     * @static
     * @param {number} status 
     * @memberof Response
     */
    static Status(status: number) {
        getParent().res.statusCode = status;
    }
    /**
     * Throws HTTP error
     * 
     * ### Example:
     * ```typescript
     * Response.Error(500);
     * ```
     * 
     * @static
     * @param {number} status 
     * @memberof Response
     */
    static Error(status: number) {
        throw status;
    }
    /**
     * Advances to next middleware or the route
     * 
     * ### Example:
     * ```typescript
     * Response.Error(500);
     * ```
     * 
     * @static
     * @param {number} status 
     * @memberof Response
     */
    static Next() {
        getParent().next();
    }
}