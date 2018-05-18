"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var glob = require("glob");
/**
 * Autoloads files with specified glob from rootPath
 *
 * ### Example:
 * ```typescript
 * autoload(__dirname, "routes/*.ts");
 * ```
 *
 * @param {string} rootPath
 * @param {string[]} paths
 */
function autoload(rootPath) {
    var paths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paths[_i - 1] = arguments[_i];
    }
    paths.forEach(function (path) {
        glob.sync(path, { cwd: rootPath }).forEach(function (file) {
            require(path_1.join(rootPath, file));
        });
    });
}
exports.autoload = autoload;
