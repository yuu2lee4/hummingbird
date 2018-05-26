import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';

export const saveImgs = async ctx=>{
    ctx.body = { errno: 0, data: ctx.req.files.map(file => `/upload/image/${file.filename}`) };
}
export const saveAttachments = async ctx=>{
    ctx.body = ctx.req.files.map(file => `/upload/attachment/${file.filename}`);
}
export const remove = async ctx=>{
    let filePath = ctx.request.body.path;

    if (!filePath.startsWith('/upload/')) {
        filePath = path.join('upload', filePath);
    }
    filePath = path.join(__dirname, '..', filePath);

    const stats = await util.promisify(fs.stat)(filePath);

    if (!stats.isFile()) {
        throw new Error('不是一个文件');
        return;
    }
    await util.promisify(fs.unlink)(filePath);
    ctx.body = { code: 0, data: true };
}
