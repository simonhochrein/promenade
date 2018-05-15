Object.defineProperty(exports, "__esModule", { value: true });
var querystring = require("querystring");
var utils_1 = require("./utils");
var RequestClass = /** @class */ (function () {
    function RequestClass() {
    }
    Object.defineProperty(RequestClass.prototype, "Query", {
        get: function () {
            return querystring.parse(utils_1.getParent().url.query);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestClass.prototype, "Body", {
        get: function () {
            return utils_1.getParent().body || {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestClass.prototype, "Files", {
        get: function () {
            return utils_1.getParent().files || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestClass.prototype, "Url", {
        get: function () {
            return utils_1.getParent().url.pathname;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RequestClass.prototype, "RawBody", {
        get: function () {
            return utils_1.getParent().rawBody || "";
        },
        enumerable: true,
        configurable: true
    });
    return RequestClass;
}());
exports.default = RequestClass;
