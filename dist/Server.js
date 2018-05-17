Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
var Router_1 = require("./Router");
var BodyParser_1 = require("./BodyParser");
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
            var ret = Router_1.Routes.resolve(req, url);
            if (ret.route) {
                var w = function __wrapper() {
                    ret.route.handler.apply(null, ret.params);
                };
                w.res = res;
                w.req = req;
                w.url = url;
                try {
                    if (req.method == "POST" || req.method == "PUT") {
                        var bufs = [];
                        req.on('data', function (data) { return bufs.push(data); });
                        req.on('end', function () {
                            var completeBody = Buffer.concat(bufs).toString();
                            var _a = BodyParser_1.default(req.headers["content-type"], completeBody), Files = _a.Files, Body = _a.Body;
                            w.files = Files;
                            w.body = Body;
                            w.rawBody = completeBody;
                            w();
                        });
                    }
                    else {
                        w();
                    }
                }
                catch (e) {
                    Router_1.Routes.handleError(e, req, res, url);
                }
            }
            else {
                Router_1.Routes.handleError(404, req, res, url);
            }
        });
    };
}
exports.default = Server;
