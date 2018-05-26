"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util = require("util");
const path = require("path");
exports.saveImgs = async (ctx) => {
    ctx.body = { errno: 0, data: ctx.req.files.map(file => `/upload/image/${file.filename}`) };
};
exports.saveAttachments = async (ctx) => {
    ctx.body = ctx.req.files.map(file => `/upload/attachment/${file.filename}`);
};
exports.remove = async (ctx) => {
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
};
//# sourceMappingURL=upload.js.map