// import { Router, Get, Post, Response, Request } from "../../index";

@Router()
class Main {
    @Get("/")
    Index() {
        Response.Send("Hello World!");
    }
}