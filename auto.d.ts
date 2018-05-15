import RequestClass from "./src/Request";
import ResponseClass from "./src/Response";

declare global {
    let Request: RequestClass;
    let Response: ResponseClass;
    let Server: Function;
    let Get;
    let Post;
    let Delete;
    let Put;
    let Router;
    let autoload: (rootPath: string, ...paths: string[]) => void;
}