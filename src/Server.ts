import { parse } from "url";
import { routes, Routes } from "./Router";
import * as querystring from 'querystring';
import { ServerRequest, ServerResponse } from "http";
import BodyParser from './BodyParser';
import { Wrapper } from "./utils";
import { createWrapper } from "./Wrapper";


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
                    var w = createWrapper(req, res, url);
                    if (req.method == "POST" || req.method == "PUT") {
                        var bufs = [];
                        req.on('data', data => bufs.push(data));
                        req.on('end', () => {
                            var completeBody = Buffer.concat(bufs).toString();
                            var { Files, Body } = BodyParser(req.headers["content-type"], completeBody);
                            w.files = Files;
                            w.body = Body;
                            w.rawBody = completeBody;
                            w(ret.route.handler);
                        })
                    } else {
                        w(ret.route.handler);
                    }
                } else {
                    Routes.handleError(404, req, res, url);
                }
            } catch (e) {
                console.error(e);
                Routes.handleError(e, req, res, url);
            }
        });
    }
}