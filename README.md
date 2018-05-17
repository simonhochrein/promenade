<div style="text-align:center"><img src="https://github.com/simonhochrein/promenade/raw/master/assets/Promenade.png"/></div>

## Install
Install using yarn
```bash
$ yarn add https://github.com/simonhochrein/promenade
```
Or npm
```bash
$ npm i https://github.com/simonhochrein/promenade
```

## Example
```
├──routes
│  └──main.ts
├──server.ts
└──tsconfig.json
```
tsconfig.json
```json
{
    "compilerOptions": {
        "outDir": "./dist",
        "target": "es5",
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "lib": [
            "es6"
        ],
        "noImplicitUseStrict": true
    }
}
```
server.ts
```typescript
import * as http from 'http';
import "promenade/auto";

autoload(__dirname, "routes/*.js");

http.createServer(Server()).listen(8888);
```
routes/main.ts
```typescript
@Router()
class Main {
    @Get("/")
    Index() {
        Response.Send("Hello World!");
    }
}
```

### Running
```bash
$ tsc
$ cd dist
$ node server.js
```

## Performance

| Express | Promenade |
| ------- | --------- |
| 16127.91 requests/second | 18899.97 requests/second  |

## [Documentation](https://simonhochrein.github.io/promenade)