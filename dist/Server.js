"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
var Router_1 = require("./Router");
var BodyParser_1 = require("./BodyParser");
var Wrapper_1 = require("./Wrapper");
/**
 * @hidden
 */
var sockets = {};
/**
 * Handles Routes from Node.JS HTTPServer instance
 *
 * ### Example:
 *
 * ```typescript
 * import * as http from 'http';
 * import "promenade/auto";
 *
 * http.createServer(Server()).listen(8888);
 * ```
 *
 * @returns Function
 */
function Server() {
    return function (req, res) {
        var url = url_1.parse(req.url);
        var pathname = url.pathname;
        Router_1.Routes.runMiddleware(req, res, url, function () {
            try {
                var ret = Router_1.Routes.resolve(req, url);
                if (ret.route) {
                    var w = Wrapper_1.createWrapper(req, res, url);
                    if (req.method == "POST" || req.method == "PUT") {
                        var bufs = [];
                        req.on('readable', function (data) { return bufs.push(data); });
                        req.on('end', function () {
                            var completeBody = Buffer.concat(bufs).toString();
                            var _a = BodyParser_1.default(req.headers["content-type"], completeBody), Files = _a.Files, Body = _a.Body;
                            w.files = Files;
                            w.body = Body;
                            w.rawBody = completeBody;
                            w(ret.route.handler);
                        });
                        return;
                    }
                    w(ret.route.handler);
                    return;
                }
                Router_1.Routes.handleError(404, req, res, url);
                return;
            }
            catch (e) {
                console.error(e);
                Router_1.Routes.handleError(e, req, res, url);
                return;
            }
        });
        return;
    };
}
exports.default = Server;
//# sourceMappingURL=Server.js.map