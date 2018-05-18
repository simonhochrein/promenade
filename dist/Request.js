"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var querystring = require("querystring");
var Wrapper_1 = require("./Wrapper");
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
            return querystring.parse(Wrapper_1.trace().url.query);
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
            return Wrapper_1.trace().body || {};
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
            return Wrapper_1.trace().files || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Request, "Method", {
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
        get: function () {
            return Wrapper_1.trace().req.method;
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
            return Wrapper_1.trace().url.pathname;
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
            return Wrapper_1.trace().rawBody || "";
        },
        enumerable: true,
        configurable: true
    });
    return Request;
}());
exports.default = Request;
