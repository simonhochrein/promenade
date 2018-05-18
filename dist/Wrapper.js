"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var seq = 0;
var __wrappers = {};
function createWrapper(req, res, url) {
    var i = (++seq).toString();
    var func = (new Function("return function __wrapper_" + i + "(fn) {fn()}")());
    __wrappers[i] = function (fn) {
        func(fn);
    };
    __wrappers[i].req = req;
    __wrappers[i].res = res;
    __wrappers[i].url = url;
    return __wrappers[i];
}
exports.createWrapper = createWrapper;
function trace() {
    var e = new Error();
    var lines = e.stack.split("\n");
    for (var i = 1; i < lines.length; i++) {
        var name = lines[i].trim().split(" ")[1];
        if (~name.indexOf("__wrapper_")) {
            return __wrappers[name.slice(10, name.length)];
        }
    }
    throw new Error("Cannot call method outside of route");
}
exports.trace = trace;
function remove() {
    var name = trace().name;
    delete __wrappers[name.slice(10, name.length)];
}
exports.remove = remove;
