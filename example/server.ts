import * as http from 'http';
import "../auto";

autoload(__dirname, "routes/*.js");

http.createServer(Server()).listen(8888);