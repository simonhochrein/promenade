Object.defineProperty(exports, "__esModule", { value: true });
var BodyParser_1 = require("./BodyParser");
/**
 * @hidden
 */
exports.routes = [];
/**
 * @hidden
 */
var middlewareHandlers = [];
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
 * @decorator
 * @param {(string | RegExp)} url
 * @returns {Decorator}
 */
function Post(url) {
    return function (target, propertyKey, descriptor) {
        exports.routes.push({ url: url, type: "POST", handler: target[propertyKey], ClassName: target.constructor.name });
    };
}
exports.Post = Post;
/**
 * HTTP Middleware
 *
 * ### Example:
 *
 * ```typescript
 * @Middleware("/test")
 * test() {
 *  Response.Send("test");
 * }
 * @Middleware()
 * test() {
 *  Response.Send("test");
 * }
 * ```
 * @decorator
 * @param {(string | RegExp)} [url]
 * @returns {Decorator}
 */
function Middleware(url) {
    return function (target, propertyKey, descriptor) {
        middlewareHandlers.push({ url: url || true, handler: target[propertyKey], ClassName: target.constructor.name });
    };
}
exports.Middleware = Middleware;
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
 * @decorator
 * @param {(string | RegExp)} url
 * @returns {Decorator}
 */
function Get(url) {
    return function (target, propertyKey, descriptor) {
        exports.routes.push({ url: url, type: "GET", handler: target[propertyKey], ClassName: target.constructor.name });
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
 * @decorator
 * @param {(string | RegExp)} url
 * @returns {Decorator}
 */
function Delete(url) {
    return function (target, propertyKey, descriptor) {
        exports.routes.push({ url: url, type: "DELETE", handler: target[propertyKey], ClassName: target.constructor.name });
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
 * @decorator
 * @param {(string | RegExp)} url
 * @returns {Decorator}
 */
function Put(url) {
    return function (target, propertyKey, descriptor) {
        exports.routes.push({ url: url, type: "PUT", handler: target[propertyKey], ClassName: target.constructor.name });
    };
}
exports.Put = Put;
/**
 * Handles errors thrown in routes
 *
 * ### Example:
 * ```typescript
 * @Exception(404)
 * Handle404() {
 *  Response.Send("404")
 * }
 *
 * @Exception(ServiceError)
 * HandleServiceError(e: ServiceError) {
 *  Response.Send(e.message)
 * }
 *
 * @Exception()
 * HandleError(e: Error) {
 *  Response.Send(e.message)
 * }
 * ```
 * @decorator
 * @param {(number | (new (...args) => Error))} [error]
 * @returns {Decorator}
 */
function Exception(error) {
    return function (target, propertyKey, descriptor) {
        if (error) {
            errorHandlers.push({
                errorType: error,
                handler: target[propertyKey]
            });
        }
        else {
            errorHandlers.push({
                errorType: true,
                handler: target[propertyKey]
            });
        }
    };
}
exports.Exception = Exception;
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
            route: exports.routes.find(function (route) {
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
    Routes.middleware = function (url) {
        var _this = this;
        var key = 0;
        var next = function () {
            for (; key < middlewareHandlers.length; key++) {
                var middleware = middlewareHandlers[key];
                if (middleware.url === true) {
                    ++key;
                    return [null, middleware];
                }
                if (baseRoutes[middleware.ClassName]) {
                    if (url.pathname.slice(0, baseRoutes[middleware.ClassName].length) == baseRoutes[middleware.ClassName]) {
                        var path = url.pathname.slice(baseRoutes[middleware.ClassName].length, url.pathname.length);
                        var match = _this.match(middleware.url, path);
                        if (match.found) {
                            var params = match.UrlParameters;
                            ++key;
                            return [params, middleware];
                        }
                    }
                }
                else {
                    var match = _this.match(middleware.url, url.pathname);
                    if (match.found) {
                        var params = match.UrlParameters;
                        ++key;
                        return [params, middleware];
                    }
                }
            }
        };
        return next;
    };
    Routes.runMiddleware = function (req, res, url, cb) {
        var params = [];
        var next = this.middleware(url);
        var w = function __wrapper() {
            var ret = next();
            if (ret) {
                var params = ret[0], handler = ret[1].handler;
                handler.apply(null, params);
            }
            else {
                cb();
            }
        };
        w.res = res;
        w.req = req;
        w.url = url;
        w.next = w;
        if (req.method == "POST" || req.method == "PUT") {
            var bufs = [];
            req.on('data', function (data) { return bufs.push(data); });
            req.on('end', function () {
                var completeBody = Buffer.concat(bufs).toString();
                var _a = BodyParser_1.default(req.headers["content-type"], completeBody), Files = _a.Files, Body = _a.Body;
                w.files = Files;
                w.body = Body;
                w.rawBody = completeBody;
                try {
                    w();
                }
                catch (e) {
                    Routes.handleError(e, req, res, url);
                }
            });
        }
        else {
            try {
                w();
            }
            catch (e) {
                Routes.handleError(e, req, res, url);
            }
        }
    };
    return Routes;
}());
exports.Routes = Routes;
