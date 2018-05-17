const { Get, Post, Put, Delete, Request, Response, Router, Server, autoload, Exception, Middleware, App } = require('./dist/index');

global["Get"] = Get;
global["Post"] = Post;
global["Put"] = Put;
global["Delete"] = Delete;
global["Middleware"] = Middleware;
global["Exception"] = Exception;
global["Request"] = Request;
global["Response"] = Response;
global["Router"] = Router;
global["Server"] = Server;
global["App"] = App;
global["autoload"] = autoload;