"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { getParent } from "./utils";
var zlib = require("zlib");
var App_1 = require("./App");
var Wrapper_1 = require("./Wrapper");
var Response = /** @class */ (function () {
    function Response() {
    }
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
    Response.Send = function (value) {
        var parent = Wrapper_1.trace();
        if (App_1.default.get('gzip') == true) {
            parent.res.setHeader("Content-Encoding", "gzip");
            var zip = zlib.createGzip();
            zip.pipe(parent.res);
            zip.write(value.toString());
            zip.end();
        }
        else {
            // parent.res.write(value);
            parent.res.end(value);
        }
        Wrapper_1.remove();
    };
    /**
     * Send JSON response to user
     *
     * ### Example:
     * ```typescript
     * Response.Json({ status: "ok" })
     * ```
     *
     * @static
     * @param {*} value
     * @memberof Response
     */
    Response.Json = function (value) {
        var parent = Wrapper_1.trace();
        if (App_1.default.get('gzip') == true) {
            parent.res.setHeader("Content-Encoding", "gzip");
            var zip = zlib.createGzip();
            zip.pipe(parent.res);
            zip.write(JSON.stringify(value));
            zip.end();
            Wrapper_1.remove();
            return;
        }
        var json = JSON.stringify(value);
        parent.res.end(json);
        Wrapper_1.remove();
    };
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
    Response.Header = function (key, value) {
        var parent = Wrapper_1.trace();
        if (parent) {
            parent.res.setHeader(key, value);
        }
        else {
            throw new Error("Can't call Response.Write outside of a route");
        }
    };
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
    Response.Status = function (status) {
        Wrapper_1.trace().res.statusCode = status;
    };
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
    Response.Error = function (status) {
        throw status;
    };
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
    Response.Next = function () {
        Wrapper_1.trace().next();
    };
    return Response;
}());
exports.default = Response;
//# sourceMappingURL=Response.js.map