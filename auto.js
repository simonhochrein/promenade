const { Get, Post, Put, Delete, Request, Response, Router, Server, autoload, ErrorHandler } = require('./dist/index');

global["Get"] = Get;
global["Post"] = Post;
global["Put"] = Put;
global["Delete"] = Delete;
global["ErrorHandler"] = ErrorHandler;
global["Request"] = Request;
global["Response"] = Response;
global["Router"] = Router;
global["Server"] = Server;
global["autoload"] = autoload;