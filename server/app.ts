import * as Koa from 'koa';
import * as mongoose from 'mongoose';
import * as bodyParser from 'koa-bodyparser';
import * as serve from 'koa-static2';
import * as config from 'config';
import * as path from 'path';
import * as process from 'process';
import router from './routers';
import { errorHandle } from './middlewares/errorHandle';
import jwt from './middlewares/jwt';

process.on('uncaughtException', (err) => {
    console.log(err);
});

process.on('unhandledRejection', (err) => {
    console.log(err);
});

mongoose.connect(`mongodb://${config.get('db.url')}/${config.get('db.name')}`);

const app = new Koa();
app.use(serve('/upload', path.join(__dirname, './upload'))) // 配置图片静态
    .use(errorHandle)
    .use(bodyParser())
    .use(jwt)
    .use(router.routes())
    .use(router.allowedMethods());

const port = process.env.PORT || 8888;
app.listen(port, ()=>{
    console.log(`app start : localhost:${port}`);
});