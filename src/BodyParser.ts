import { parse } from "querystring";
import { File } from "./File";

function parseLines(lines) {
    var section = -1;
    var file: File = {
        Name: "",
        FileName: "",
        Type: "",
        Body: null
    };
    var field = { Name: "", Value: "" };

    var name = "";
    var isFile = false;
    var body = "";

    for (var line of lines) {

        if (line == "") {
            section++;
            if (section < 2) continue;
        }
        switch (section) {
            case 0:
                if (/Content-Disposition: form-data; /.test(line)) {
                    for (var pairs of line.slice(32, line.length).split(";")) {
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
                } else {
                    field.Name = name;
                    field.Value = body;
                }
                break;
        }
    }
    return { FileBody: file, FieldBody: field, IsFile: isFile };
}

export default function BodyParser(type, body) {
    var parts = type.split(";");
    var type = parts[0];
    var Files = [];
    var Body = {};

    switch (type) {
        case "multipart/form-data":
            var boundary = "--" + parts[1].trim().split("=")[1];
            var segments = body.slice(0, -4).split(boundary);
            for (var segment of segments) {
                var lines = segment.split("\r\n");
                var { FileBody, FieldBody, IsFile } = parseLines(lines);
                if (IsFile) {
                    Files.push(FileBody);
                } else {
                    if (FieldBody.Name != "") {
                        Body[FieldBody.Name] = FieldBody.Value;
                    }
                }
            }
            return { Files, Body };
        case "application/x-www-form-urlencoded":
            return { Files: [], Body: parse(body) };
        case "application/json":
            try {
                return { Files: [], Body: JSON.parse(body) };
            } catch {
                console.error("Malformed JSON Body");
                break;
            }
    }
}