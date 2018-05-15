import { readdirSync } from "fs";
import { join } from "path";
import * as glob from 'glob';

export function autoload(root, ...paths) {
    paths.forEach((path) => {
        glob.sync(path, { cwd: root }).forEach(file => {
            require(join(root, file));
        });
    })
}