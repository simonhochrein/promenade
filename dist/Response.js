Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var ResponseClass = /** @class */ (function () {
    function ResponseClass() {
    }
    ResponseClass.prototype.Send = function (value) {
        var parent;
        if (parent = utils_1.getParent()) {
            if (typeof value == "object") {
                parent.res.write(JSON.stringify(value));
                parent.res.end();
            }
            else {
                parent.res.write(value.toString());
                parent.res.end();
            }
        }
        else {
            throw new Error("Can't call Response.Write outside of a route");
        }
    };
    ResponseClass.prototype.Header = function (key, value) {
        var parent = utils_1.getParent();
        if (parent) {
            parent.res.setHeader(key, value);
        }
        else {
            throw new Error("Can't call Response.Write outside of a route");
        }
    };
    ResponseClass.prototype.Status = function (status) {
        var parent = utils_1.getParent();
        if (parent) {
            parent.res.statusCode = status;
        }
        else {
            throw new Error("Can't call Response.Write outside of a route");
        }
    };
    return ResponseClass;
}());
exports.default = ResponseClass;
