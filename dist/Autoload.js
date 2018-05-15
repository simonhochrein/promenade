Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var glob = require("glob");
function autoload(root) {
    var paths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paths[_i - 1] = arguments[_i];
    }
    paths.forEach(function (path) {
        glob.sync(path, { cwd: root }).forEach(function (file) {
            require(path_1.join(root, file));
        });
    });
}
exports.autoload = autoload;
