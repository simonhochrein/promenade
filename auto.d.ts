import RequestClass from "./src/Request";
import ResponseClass from "./src/Response";
import * as Promenade from './src/index';
declare global {
    let Request: typeof Promenade.Request;
    let Response: typeof Promenade.Response;
    let Server: typeof Promenade.Server;
    let Get: typeof Promenade.Get;
    let Post: typeof Promenade.Post;
    let Delete: typeof Promenade.Delete;
    let Put: typeof Promenade.Put;
    let Exception: typeof Promenade.Exception;
    let Middleware: typeof Promenade.Middleware;
    let Router: typeof Promenade.Router;
    let App: typeof Promenade.App;
    let autoload: typeof Promenade.autoload;
}