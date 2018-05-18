"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var App = /** @class */ (function () {
    function App() {
    }
    /**
     * Gets app local
     *
     * ### Example:
     * ```typescript
     * console.log(App.get("setting"));
     * ```
     * @static
     * @param {(SettingName | string)} key
     * @returns
     * @memberof App
     */
    App.get = function (key) {
        return this.settings[key];
    };
    /**
     * Sets app local
     *
     * ### Example:
     * ```typescript
     * App.set("setting", "value");
     * ```
     *
     * @static
     * @param {(SettingName | string)} key
     * @param {any} value
     * @returns
     * @memberof App
     */
    App.set = function (key, value) {
        return this.settings[key] = value;
    };
    App.settings = {
        gzip: false
    };
    return App;
}());
exports.default = App;
//# sourceMappingURL=App.js.map