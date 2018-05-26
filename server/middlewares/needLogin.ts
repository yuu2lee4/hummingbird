export function needLogin(ifNeedLogin: boolean = true) {
    return function (ctx, next) {
        if (ifNeedLogin) {
            if (ctx.state.user) {
                return next();
            }
            const err =new Error('需要登录！');
            err.status = 401;
            throw err;
        } else {
            if (!ctx.state.user) {
                return next();
            } 
            throw new Error('您已登录！');
        }
    }
}