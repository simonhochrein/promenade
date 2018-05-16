Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 */
var routes = [];
exports.routes = routes;
/**
 * @hidden
 */
var baseRoutes = {};
/**
 * @hidden
 */
var errorHandlers = [];
/**
 * Handles POST request with specified url
 *
 * ### Example:
 *
 * ```typescript
 * @Post("/test")
 * test() {
 *  Response.Send("test");
 * }
 * ```
 *
 * @param {(string | RegExp)} url
 * @returns {Function}
 */
function Post(url) {
    return function (target, propertyKey, descriptor) {
        routes.push({ url: url, type: "POST", handler: target[propertyKey], ClassName: target.constructor.name });
    };
}
exports.Post = Post;
/**
 * Handles GET request with specified url
 *
 * ### Example:
 *
 * ```typescript
 * @Get("/test")
 * test() {
 *  Response.Send("test");
 * }
 * ```
 *
 * @param {(string | RegExp)} url
 * @returns {Function}
 */
function Get(url) {
    return function (target, propertyKey, descriptor) {
        routes.push({ url: url, type: "GET", handler: target[propertyKey], ClassName: target.constructor.name });
    };
}
exports.Get = Get;
/**
 * Handles DELETE request with specified url
 *
 * ### Example:
 *
 * ```typescript
 * @Delete("/test")
 * test() {
 *  Response.Send("test");
 * }
 * ```
 *
 * @param {(string | RegExp)} url
 * @returns {Function}
 */
function Delete(url) {
    return function (target, propertyKey, descriptor) {
        routes.push({ url: url, type: "DELETE", handler: target[propertyKey], ClassName: target.constructor.name });
    };
}
exports.Delete = Delete;
/**
 * Handles PUT request with specified url
 *
 * ### Example:
 *
 * ```typescript
 * @Put("/test")
 * test() {
 *  Response.Send("test");
 * }
 * ```
 *
 * @param {(string | RegExp)} url
 * @returns {Function}
 */
function Put(url) {
    return function (target, propertyKey, descriptor) {
        routes.push({ url: url, type: "PUT", handler: target[propertyKey], ClassName: target.constructor.name });
    };
}
exports.Put = Put;
function ErrorHandler(error) {
    return function (target, propertyKey, descriptor) {
        if (error) {
            if (typeof error == "number") {
                errorHandlers.push({
                    errorType: error,
                    handler: target[propertyKey]
                });
            }
            else {
                errorHandlers.push({
                    errorType: error,
                    handler: target[propertyKey]
                });
            }
        }
        else {
            errorHandlers.push({
                errorType: true,
                handler: target[propertyKey]
            });
        }
    };
}
exports.ErrorHandler = ErrorHandler;
/**
 * @hidden
 */
function Router(basePath) {
    return function (constructor) {
        var router = new constructor();
        if (basePath) {
            baseRoutes[constructor.name] = basePath;
        }
    };
}
exports.Router = Router;
/**
 * @hidden
 */
var Routes = /** @class */ (function () {
    function Routes() {
    }
    Routes.match = function (a, b) {
        if (a instanceof RegExp) {
            return { found: a.test(b), UrlParameters: [] };
        }
        else {
            if (a.slice(-1) == "/") {
                a = a.slice(0, -1);
            }
            if (b.slice(-1) == "/") {
                b = b.slice(0, -1);
            }
            var partsA = a.split("/");
            var partsB = b.split("/");
            if (partsA.length !== partsB.length)
                return { found: false, UrlParameters: [] };
            var urlParameters = [];
            for (var i in partsA) {
                if (partsA[i] == partsB[i]) {
                }
                else if (partsA[i][0] == ":") {
                    urlParameters.push(partsB[i]);
                }
                else {
                    return { found: false, UrlParameters: [] };
                }
            }
            return {
                found: true,
                UrlParameters: urlParameters
            };
        }
    };
    Routes.handleError = function (error, req, res, url) {
        var errorHandler = errorHandlers.find(function (errorHandler) {
            if (errorHandler.errorType == true)
                return true;
            if (error && error instanceof Error) {
                if (error instanceof errorHandler.errorType) {
                    return true;
                }
            }
            else if (error == errorHandler.errorType) {
                return true;
            }
            return false;
        });
        if (errorHandler) {
            var w = function __wrapper() {
                errorHandler.handler(error);
            };
            w.res = res;
            w.req = req;
            w.url = url;
            w();
        }
        else {
            res.statusCode = 500;
            res.write("" + error);
            res.end();
        }
    };
    Routes.resolve = function (req, url) {
        var _this = this;
        var params = [];
        return {
            route: routes.find(function (route) {
                if (route.type != req.method)
                    return false;
                if (baseRoutes[route.ClassName]) {
                    if (url.pathname.slice(0, baseRoutes[route.ClassName].length) == baseRoutes[route.ClassName]) {
                        var path = url.pathname.slice(baseRoutes[route.ClassName].length, url.pathname.length);
                        var match = _this.match(route.url, path);
                        if (match.found) {
                            params = match.UrlParameters;
                        }
                        return match.found;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    var match = _this.match(route.url, url.pathname);
                    if (match.found) {
                        params = match.UrlParameters;
                    }
                    return match.found;
                }
            }),
            params: params
        };
    };
    return Routes;
}());
exports.Routes = Routes;
