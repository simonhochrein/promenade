import { parse } from "url";
import { routes, Routes } from "./Router";
import * as querystring from 'querystring';
import { ServerRequest, ServerResponse } from "http";
import BodyParser from './BodyParser';


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
export default function Server(): Function {
    return function (req: ServerRequest, res: ServerResponse) {
        var url = parse(req.url);
        var pathname = url.pathname;
        var ret = Routes.resolve(req, url);
        if (ret.route) {
            var w = function __wrapper() {
                ret.route.handler.apply(null, ret.params);
            };
            (w as any).res = res;
            (w as any).req = req;
            (w as any).url = url;
            if (req.method == "POST" || req.method == "PUT") {
                var bufs = [];
                req.on('data', data => bufs.push(data));
                req.on('end', () => {
                    var completeBody = Buffer.concat(bufs).toString();
                    var { Files, Body } = BodyParser(req.headers["content-type"], completeBody);
                    (w as any).files = Files;
                    (w as any).body = Body;
                    (w as any).rawBody = completeBody;
                    w();
                })
            } else {
                w();
            }
        } else {
            res.end("404");
        }
    }
}