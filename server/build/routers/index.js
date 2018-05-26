"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koaRouter = require("koa-router");
const user_1 = require("./user");
const post_1 = require("./post");
const category_1 = require("./category");
const upload_1 = require("./upload");
const comment_1 = require("./comment");
const collect_1 = require("./collect");
const api = new koaRouter();
api.use(user_1.default.routes())
    .use(post_1.default.routes())
    .use(category_1.default.routes())
    .use(upload_1.default.routes())
    .use(collect_1.default.routes())
    .use(comment_1.default.routes());
exports.default = api.use('/api', api.routes(), api.allowedMethods());
//# sourceMappingURL=index.js.map