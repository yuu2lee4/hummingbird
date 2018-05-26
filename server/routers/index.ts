import * as koaRouter from 'koa-router';
import user from './user';
import post from './post';
import category from './category';
import upload from './upload';
import comment from './comment';
import collect from './collect';

const api = new koaRouter();
api.use(user.routes())
    .use(post.routes())
    .use(category.routes())
    .use(upload.routes())
    .use(collect.routes())
    .use(comment.routes());

export default api.use('/api',
                  api.routes(),
                  api.allowedMethods());