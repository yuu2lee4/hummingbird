export async function errorHandle (ctx, next) {
    try {
        await next();
    } catch (err) {
        ctx.body = {
            code: err.status || 500,
            msg: err.originalError ? err.originalError.message : err.message
        }
    }
}
