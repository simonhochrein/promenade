Object.defineProperty(exports, "__esModule", { value: true });
var routes = [];
exports.routes = routes;
var baseRoutes = {};
function Post(url) {
    return function (target, propertyKey, descriptor) {
        routes.push({ url: url, type: "POST", handler: target[propertyKey], ClassName: target.constructor.name });
    };
}
exports.Post = Post;
function Get(url) {
    return function (target, propertyKey, descriptor) {
        routes.push({ url: url, type: "GET", handler: target[propertyKey], ClassName: target.constructor.name });
    };
}
exports.Get = Get;
function Delete(url) {
    return function (target, propertyKey, descriptor) {
        routes.push({ url: url, type: "DELETE", handler: target[propertyKey], ClassName: target.constructor.name });
    };
}
exports.Delete = Delete;
function Put(url) {
    return function (target, propertyKey, descriptor) {
        routes.push({ url: url, type: "PUT", handler: target[propertyKey], ClassName: target.constructor.name });
    };
}
exports.Put = Put;
function Router(basePath) {
    return function (constructor) {
        var router = new constructor();
        if (basePath) {
            baseRoutes[constructor.name] = basePath;
        }
    };
}
exports.Router = Router;
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
