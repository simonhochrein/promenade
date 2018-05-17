Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var zlib = require("zlib");
var App_1 = require("./App");
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
        var parent = utils_1.getParent();
        if (typeof value == "object") {
            if (App_1.default.get('gzip') == true) {
                parent.res.setHeader("Content-Encoding", "gzip");
                var zip = zlib.createGzip();
                zip.pipe(parent.res);
                zip.write(JSON.stringify(value));
                zip.end();
            }
            else {
                parent.res.write(JSON.stringify(value));
                parent.res.end();
            }
        }
        else {
            if (App_1.default.get('gzip') == true) {
                parent.res.setHeader("Content-Encoding", "gzip");
                var zip = zlib.createGzip();
                zip.pipe(parent.res);
                zip.write(value.toString());
                zip.end();
            }
            else {
                parent.res.write(value.toString());
                parent.res.end();
            }
        }
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
        var parent = utils_1.getParent();
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
        utils_1.getParent().res.statusCode = status;
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
        utils_1.getParent().next();
    };
    return Response;
}());
exports.default = Response;
