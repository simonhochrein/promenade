Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
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
        var parent;
        if (parent = utils_1.getParent()) {
            if (typeof value == "object") {
                parent.res.write(JSON.stringify(value));
                parent.res.end();
            }
            else {
                parent.res.write(value.toString());
                parent.res.end();
            }
        }
        else {
            throw new Error("Can't call Response.Write outside of a route");
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
        var parent = utils_1.getParent();
        if (parent) {
            parent.res.statusCode = status;
        }
        else {
            throw new Error("Can't call Response.Write outside of a route");
        }
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
    return Response;
}());
exports.default = Response;
