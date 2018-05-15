import { readdirSync } from "fs";
import { join } from "path";
import * as glob from 'glob';

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
export function autoload(rootPath: string, ...paths: string[]) {
    paths.forEach((path) => {
        glob.sync(path, { cwd: rootPath }).forEach(file => {
            require(join(rootPath, file));
        });
    })
}