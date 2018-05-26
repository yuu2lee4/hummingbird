"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function errorHandle(ctx, next) {
    try {
        await next();
    }
    catch (err) {
        ctx.body = {
            code: err.status || 500,
            msg: err.originalError ? err.originalError.message : err.message
        };
    }
}
exports.errorHandle = errorHandle;
//# sourceMappingURL=errorHandle.js.map