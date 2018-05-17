import { parse } from "url";
import { routes, Routes } from "./Router";
import * as querystring from 'querystring';
import { ServerRequest, ServerResponse } from "http";
import BodyParser from './BodyParser';
import { Wrapper } from "./utils";


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
export default function Server(): (req: ServerRequest, res: ServerResponse) => void {
    return function (req: ServerRequest, res: ServerResponse) {
        var url = parse(req.url);
        var pathname = url.pathname;
        Routes.runMiddleware(req, res, url, () => {
            try {
                var ret = Routes.resolve(req, url);
                if (ret.route) {
                    var w: Wrapper = function __wrapper() {
                        ret.route.handler.apply(null, ret.params);
                    };
                    w.res = res;
                    w.req = req;
                    w.url = url;
                    if (req.method == "POST" || req.method == "PUT") {
                        var bufs = [];
                        req.on('data', data => bufs.push(data));
                        req.on('end', () => {
                            var completeBody = Buffer.concat(bufs).toString();
                            var { Files, Body } = BodyParser(req.headers["content-type"], completeBody);
                            w.files = Files;
                            w.body = Body;
                            w.rawBody = completeBody;
                            w();
                        })
                    } else {
                        w();
                    }
                } else {
                    Routes.handleError(404, req, res, url);
                }
            } catch (e) {
                Routes.handleError(e, req, res, url);
            }
        });
    }
}