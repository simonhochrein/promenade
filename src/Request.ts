import * as querystring from 'querystring';
import { getParent } from './utils';
import { File } from './File';

export default class RequestClass {
    get Query() {
        return querystring.parse(getParent().url.query);
    }

    get Body(): { [name: string]: any } {
        return getParent().body || {};
    }

    get Files(): File[] {
        return getParent().files || [];
    }

    get Url(): string {
        return getParent().url.pathname;
    }

    get RawBody() {
        return getParent().rawBody || "";
    }
}