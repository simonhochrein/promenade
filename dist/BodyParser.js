"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var querystring_1 = require("querystring");
/**
 * @hidden
 */
function parseLines(lines) {
    var section = -1;
    var file = {
        Name: "",
        FileName: "",
        Type: "",
        Body: null
    };
    var field = { Name: "", Value: "" };
    var name = "";
    var isFile = false;
    var body = "";
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        if (line == "") {
            section++;
            if (section < 2)
                continue;
        }
        switch (section) {
            case 0:
                if (/Content-Disposition: form-data; /.test(line)) {
                    for (var _a = 0, _b = line.slice(32, line.length).split(";"); _a < _b.length; _a++) {
                        var pairs = _b[_a];
                        var pair = pairs.split("=");
                        var key = pair[0].trim();
                        var value = pair[1].slice(1, -1);
                        if (key == "name") {
                            name = value;
                        }
                        if (key == "filename") {
                            file.FileName = value;
                            isFile = true;
                        }
                    }
                }
                if (isFile && /Header Content-Type: /.test(line)) {
                    file.Type = line.slice(21, line.length);
                }
                break;
            case 1:
                body += line;
                break;
            case 2:
                if (isFile) {
                    file.Name = name;
                    file.Body = Buffer.from(body);
                }
                else {
                    field.Name = name;
                    field.Value = body;
                }
                break;
        }
    }
    return { FileBody: file, FieldBody: field, IsFile: isFile };
}
/**
 * @hidden
 */
function BodyParser(type, body) {
    var parts = type.split(";");
    var type = parts[0];
    var Files = [];
    var Body = {};
    switch (type) {
        case "multipart/form-data":
            var boundary = "--" + parts[1].trim().split("=")[1];
            var segments = body.slice(0, -4).split(boundary);
            for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
                var segment = segments_1[_i];
                var lines = segment.split("\r\n");
                var _a = parseLines(lines), FileBody = _a.FileBody, FieldBody = _a.FieldBody, IsFile = _a.IsFile;
                if (IsFile) {
                    Files.push(FileBody);
                }
                else {
                    if (FieldBody.Name != "") {
                        Body[FieldBody.Name] = FieldBody.Value;
                    }
                }
            }
            return { Files: Files, Body: Body };
        case "application/x-www-form-urlencoded":
            return { Files: [], Body: querystring_1.parse(body) };
        case "application/json":
            try {
                return { Files: [], Body: JSON.parse(body) };
            }
            catch (_b) {
                console.error("Malformed JSON Body");
                break;
            }
    }
}
exports.default = BodyParser;
//# sourceMappingURL=BodyParser.js.map