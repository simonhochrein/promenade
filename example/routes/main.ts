// import { Router, Get, Post, Response, Request } from "../../index";

@Router()
class Main {
    @Get("/")
    Index() {
        Response.Header("Connection", "Close");
        Response.Send("Hello World!");
    }
}