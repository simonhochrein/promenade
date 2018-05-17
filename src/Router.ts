import { ServerRequest, ServerResponse } from "http";
import { inspect } from "util";
/**
 * @hidden
 */
type Decorator = (target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>) => void;

/**
 * @hidden
 */
export let routes = [

];
/**
 * @hidden
 */
let middlewareHandlers = [

];
/**
 * @hidden
 */
let baseRoutes: { [name: string]: any } = {

};
/**
 * @hidden
 */
let errorHandlers: { errorType: boolean | number | (new (...args) => Error), handler: (e: Error | number) => void }[] = [

];
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
export function Post(url: string | RegExp): Decorator {
    return function (target: Object,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>) {
        routes.push({ url, type: "POST", handler: target[propertyKey], ClassName: target.constructor.name });
    }
}

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
export function Middleware(url?: string | RegExp): Decorator {
    return function (target: Object,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>) {
        middlewareHandlers.push({ url: url || true, handler: target[propertyKey], ClassName: target.constructor.name });
    }
}

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
export function Get(url: string | RegExp): Decorator {
    return function (target: Object,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>) {
        routes.push({ url, type: "GET", handler: target[propertyKey], ClassName: target.constructor.name });
    }
}
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
export function Delete(url: string | RegExp): Decorator {
    return function (target: Object,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>) {
        routes.push({ url, type: "DELETE", handler: target[propertyKey], ClassName: target.constructor.name });
    }
}
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
export function Put(url: string | RegExp): Decorator {
    return function (target: Object,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>) {
        routes.push({ url, type: "PUT", handler: target[propertyKey], ClassName: target.constructor.name });
    }
}

/**
 * Handles errors thrown in routes
 * 
 * ### Example:
 * ```typescript
 * @ErrorHandler(404)
 * Handle404() {
 *  Response.Send("404")
 * }
 * 
 * @ErrorHandler(ServiceError)
 * HandleServiceError(e: ServiceError) {
 *  Response.Send(e.message)
 * }
 * 
 * @ErrorHandler()
 * HandleError(e: Error) {
 *  Response.Send(e.message)
 * }
 * ```
 * @decorator
 * @param {(number | (new (...args) => Error))} [error] 
 * @returns {Decorator}
 */
export function Exception(error?: number | (new (...args) => Error)): Decorator {
    return function (target: Object,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>) {
        if (error) {
            errorHandlers.push({
                errorType: error,
                handler: target[propertyKey]
            })
        } else {
            errorHandlers.push({
                errorType: true,
                handler: target[propertyKey]
            })
        }
    }
}

/**
 * @hidden
 */
export function Router(basePath?: string) {
    return function (constructor) {
        var router = new constructor();
        if (basePath) {
            baseRoutes[constructor.name] = basePath;
        }
    }
}
/**
 * @hidden
 */
export class Routes {
    static match(a: string | RegExp, b: string): { UrlParameters: string[], found: boolean } {
        if (a instanceof RegExp) {
            return { found: a.test(b), UrlParameters: [] };
        } else {
            if (a.slice(-1) == "/") {
                a = a.slice(0, -1);
            }
            if (b.slice(-1) == "/") {
                b = b.slice(0, -1);
            }

            var partsA = a.split("/");
            var partsB = b.split("/");

            if (partsA.length !== partsB.length) return { found: false, UrlParameters: [] };
            var urlParameters = [];
            for (var i in partsA) {
                if (partsA[i] == partsB[i]) {

                } else if (partsA[i][0] == ":") {
                    urlParameters.push(partsB[i]);
                } else {
                    return { found: false, UrlParameters: [] };
                }
            }
            return {
                found: true,
                UrlParameters: urlParameters
            }
        }
    }

    static handleError(error: Error | number, req, res, url) {
        var errorHandler = errorHandlers.find((errorHandler) => {
            if (errorHandler.errorType == true) return true;

            if (error && error instanceof Error) {
                if (error instanceof (errorHandler.errorType as (new () => Error))) {
                    return true;
                }
            } else if (error == errorHandler.errorType) {
                return true;
            }
            return false;
        });
        if (errorHandler) {
            var w = function __wrapper() {
                errorHandler.handler(error);
            };
            (w as any).res = res;
            (w as any).req = req;
            (w as any).url = url;
            w();
        } else {
            res.statusCode = 500;
            res.write(`${error}`);
            res.end();
        }
    }
    static resolve(req: ServerRequest, url) {
        var params = [];
        return {
            route: routes.find((route) => {
                if (route.type != req.method) return false;
                if (baseRoutes[route.ClassName]) {
                    if (url.pathname.slice(0, baseRoutes[route.ClassName].length) == baseRoutes[route.ClassName]) {
                        var path = url.pathname.slice(baseRoutes[route.ClassName].length, url.pathname.length);
                        var match = this.match(route.url, path);
                        if (match.found) {
                            params = match.UrlParameters;
                        }
                        return match.found;
                    } else {
                        return false;
                    }
                } else {
                    var match = this.match(route.url, url.pathname);
                    if (match.found) {
                        params = match.UrlParameters;
                    }
                    return match.found;
                }
            }),
            params
        };
    }

    static middleware(url) {
        var key = 0;
        var next = () => {
            for (; key < middlewareHandlers.length; key++) {
                var middleware = middlewareHandlers[key];
                if (middleware.url === true) {
                    ++key;
                    return [null, middleware];
                }

                if (baseRoutes[middleware.ClassName]) {
                    if (url.pathname.slice(0, baseRoutes[middleware.ClassName].length) == baseRoutes[middleware.ClassName]) {
                        var path = url.pathname.slice(baseRoutes[middleware.ClassName].length, url.pathname.length);
                        var match = this.match(middleware.url, path);
                        if (match.found) {
                            var params = match.UrlParameters;
                            ++key;
                            return [params, middleware];
                        }
                    }
                } else {
                    var match = this.match(middleware.url, url.pathname);
                    if (match.found) {
                        var params = match.UrlParameters;
                        ++key;
                        return [params, middleware];
                    }
                }
            }
        }
        return next;
    }
    static runMiddleware(req: ServerRequest, res: ServerResponse, url, cb) {
        var params = [];
        var next = this.middleware(url);
        function runMiddleware() {
            var w = function __wrapper() {
                var ret = next();
                if (ret) {
                    var [params, { handler }] = ret;
                    handler.apply(null, params);
                } else {
                    cb();
                }
            };
            (w as any).res = res;
            (w as any).req = req;
            (w as any).url = url;
            (w as any).next = runMiddleware;
            w();
        }
        runMiddleware();
        // var m = middlewareHandlers.filter((middleware, key) => {

        // });
        // m.forEach(({ handler }) => {
        //     handler()
        // });
    }
}