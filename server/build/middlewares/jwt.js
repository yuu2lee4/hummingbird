"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const jwt = require("koa-jwt");
exports.default = jwt({
    secret: config.get('jwt.secret'),
    cookie: 'token',
    passthrough: true,
    isRevoked(ctx, decodedToken, token) {
        // 走这儿说明cookie里的token还未过期，那么需要刷新过期时间
        ctx.cookies.set('token', token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
        });
        return Promise.resolve(false);
    },
});
//# sourceMappingURL=jwt.js.map