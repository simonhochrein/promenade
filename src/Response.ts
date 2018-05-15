import { getParent } from "./utils";

export default class ResponseClass {
    Send(value: any) {
        let parent;
        if (parent = getParent()) {
            if (typeof value == "object") {
                parent.res.write(JSON.stringify(value));
                parent.res.end();
            } else {
                parent.res.write(value.toString());
                parent.res.end();
            }
        } else {
            throw new Error("Can't call Response.Write outside of a route");
        }
    }
    Header(key: string, value: string) {
        let parent = getParent();
        if (parent) {
            parent.res.setHeader(key, value);
        } else {
            throw new Error("Can't call Response.Write outside of a route");
        }
    }
    Status(status: number) {
        let parent = getParent();
        if (parent) {
            parent.res.statusCode = status;
        } else {
            throw new Error("Can't call Response.Write outside of a route");
        }
    }
}