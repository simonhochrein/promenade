type SettingName = "gzip";

export default class App {
    public static settings = {
        gzip: true
    };
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
    static get(key: SettingName | string) {
        return this.settings[key];
    }
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
    static set(key: SettingName | string, value: any) {
        return this.settings[key] = value;
    }
}