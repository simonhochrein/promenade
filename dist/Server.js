Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
var Router_1 = require("./Router");
var BodyParser_1 = require("./BodyParser");
function Server() {
    return function (req, res) {
        var url = url_1.parse(req.url);
        var pathname = url.pathname;
        var ret = Router_1.Routes.resolve(req, url);
        if (ret.route) {
            var w = function __wrapper() {
                ret.route.handler.apply(null, ret.params);
            };
            w.res = res;
            w.req = req;
            w.url = url;
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
        else {
            res.end("404");
        }
    };
}
exports.default = Server;
