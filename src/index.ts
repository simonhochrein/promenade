import { parse } from "url";
import * as querystring from 'querystring';
import { readdirSync } from 'fs';
import { join } from "path";
import { ServerResponse } from "http";
import RequestClass from "./Request";
import ResponseClass from "./Response";
import { Get, Post, Put, Delete, Router } from './Router';
import { autoload } from "./Autoload";
import Server from './Server';

let Request = new RequestClass();
let Response = new ResponseClass();

export {
    Request,
    Response,
    Server,
    Get,
    Post,
    Put,
    Delete,
    Router,
    autoload
};