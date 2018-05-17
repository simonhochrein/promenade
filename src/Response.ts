import { getParent } from "./utils";

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
        let parent;
        if (parent = getParent()) {
            if (typeof value == "object") {
                parent.res.write(JSON.stringify(value));
                parent.res.end();
            } else {
                parent.res.write(value.toString());
                parent.res.end();
            }
        } else {
            throw new Error("Can't call Response.Write outside of a route");
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
        let parent = getParent();
        if (parent) {
            parent.res.statusCode = status;
        } else {
            throw new Error("Can't call Response.Write outside of a route");
        }
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