"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const mongoose = require("mongoose");
const bodyParser = require("koa-bodyparser");
const serve = require("koa-static2");
const config = require("config");
const path = require("path");
const process = require("process");
const routers_1 = require("./routers");
const errorHandle_1 = require("./middlewares/errorHandle");
const jwt_1 = require("./middlewares/jwt");
process.on('uncaughtException', (err) => {
    console.log(err);
});
process.on('unhandledRejection', (err) => {
    console.log(err);
});
mongoose.connect(`mongodb://${config.get('db.url')}/${config.get('db.name')}`);
const app = new Koa();
app.use(serve('/upload', path.join(__dirname, './upload'))) // 配置图片静态
    .use(errorHandle_1.errorHandle)
    .use(bodyParser())
    .use(jwt_1.default)
    .use(routers_1.default.routes())
    .use(routers_1.default.allowedMethods());
const port = process.env.PORT || 8888;
app.listen(port, () => {
    console.log(`app start : localhost:${port}`);
});
//# sourceMappingURL=app.js.map