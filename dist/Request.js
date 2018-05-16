Object.defineProperty(exports, "__esModule", { value: true });
var querystring = require("querystring");
var utils_1 = require("./utils");
var Request = /** @class */ (function () {
    function Request() {
    }
    Object.defineProperty(Request, "Query", {
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
        get: function () {
            return querystring.parse(utils_1.getParent().url.query);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Request, "Body", {
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
        get: function () {
            return utils_1.getParent().body || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Request, "Files", {
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
        get: function () {
            return utils_1.getParent().files || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Request, "Url", {
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
        get: function () {
            return utils_1.getParent().url.pathname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Request, "RawBody", {
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
        get: function () {
            return utils_1.getParent().rawBody || "";
        },
        enumerable: true,
        configurable: true
    });
    return Request;
}());
exports.default = Request;
