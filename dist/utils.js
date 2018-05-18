"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 */
function getParent() {
    var caller = getParent.caller;
    while (caller && caller.name != "__wrapper") {
        caller = caller.caller;
    }
    if (!caller) {
        throw new Error("Can't use Request." + getParent.caller + " outside of a route");
    }
    return caller;
}
exports.getParent = getParent;
