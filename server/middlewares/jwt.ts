import * as config from 'config';
import * as jwt from 'koa-jwt';

export default jwt({
    secret: config.get('jwt.secret'),
    cookie: 'token',
    passthrough: true,
    isRevoked(ctx, decodedToken, token) {
        // 走这儿说明cookie里的token还未过期，那么需要刷新过期时间
        ctx.cookies.set(
            'token',
            token,
            {
              maxAge: 24 * 60 * 60 * 1000, // cookie有效时长
              httpOnly: false,  // 是否只用于http请求中获取
            }
        );
        return Promise.resolve(false);
    },
});
