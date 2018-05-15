import { ServerRequest } from "http";

let routes = [

];

let baseRoutes: { [name: string]: any } = {

};

function Post(url: string | RegExp): any {
    return function (target: Object,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>) {
        routes.push({ url, type: "POST", handler: target[propertyKey], ClassName: target.constructor.name });
    }
}

function Get(url: string | RegExp): any {
    return function (target: Object,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>) {
        routes.push({ url, type: "GET", handler: target[propertyKey], ClassName: target.constructor.name });
    }
}

function Delete(url: string | RegExp): any {
    return function (target: Object,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>) {
        routes.push({ url, type: "DELETE", handler: target[propertyKey], ClassName: target.constructor.name });
    }
}

function Put(url: string | RegExp): any {
    return function (target: Object,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<any>) {
        routes.push({ url, type: "PUT", handler: target[propertyKey], ClassName: target.constructor.name });
    }
}

function Router(basePath?: string) {
    return function (constructor) {
        var router = new constructor();
        if (basePath) {
            baseRoutes[constructor.name] = basePath;
        }
    }
}

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
}

export {
    routes,
    Post,
    Get,
    Put,
    Delete,
    Router
}